import os
from typing import TypedDict, List
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from .prompts import LEARNING_PROMPT

# Define the state structure
class ChatState(TypedDict):
    messages: List[HumanMessage | AIMessage | SystemMessage]

# Initialize the OpenAI model
def create_llm(stream: bool = False):
    """Create and return the OpenAI GPT-4.1 model.

    Args:
        stream (bool): Whether to enable token streaming. Defaults to False.
    """
    # Make sure to set your OPENAI_API_KEY environment variable
    return ChatOpenAI(
        model_name="gpt-4.1",  # Update if OpenAI adopts a different official alias
        temperature=1.2,
        top_p=0.98,
        streaming=stream
    )

# Define the chatbot node
def chatbot_node(state: ChatState):
    """Main chatbot node that processes messages and generates responses"""
    llm = create_llm()
    
    # Get the current messages
    messages = state["messages"]
    
    # Add system prompt if this is the first interaction
    if not messages or not any(isinstance(msg, SystemMessage) for msg in messages):
        system_message = SystemMessage(content=LEARNING_PROMPT)
        messages = [system_message] + messages
    
    # Generate response
    response = llm.invoke(messages)
    
    # Add the AI response to messages
    updated_messages = messages + [response]
    
    return {"messages": updated_messages}

# Create the graph
def create_chatbot_graph():
    """Create and return the LangGraph chatbot"""
    # Create the state graph
    workflow = StateGraph(ChatState)
    
    # Add the chatbot node
    workflow.add_node("chatbot", chatbot_node)
    
    # Set the entry point
    workflow.set_entry_point("chatbot")
    
    # Add edge to end after chatbot response
    workflow.add_edge("chatbot", END)
    
    # Compile the graph
    return workflow.compile()

# Main chatbot class
class LangGraphChatbot:
    def __init__(self):
        self.graph = create_chatbot_graph()
        self.conversation_state = {"messages": []}
    
    def _ensure_system_prompt(self):
        """Ensure the system prompt is the first message in the history."""
        messages = self.conversation_state["messages"]
        if not any(isinstance(m, SystemMessage) for m in messages):
            self.conversation_state["messages"] = [SystemMessage(content=LEARNING_PROMPT)] + messages

    def chat(self, user_input: str) -> str:
        """Send a message to the chatbot and get a response"""
        # Add user message to state
        user_message = HumanMessage(content=user_input)
        self.conversation_state["messages"].append(user_message)
        
        # Run the graph
        result = self.graph.invoke(self.conversation_state)
        
        # Update conversation state
        self.conversation_state = result
        
        # Return the latest AI message
        ai_messages = [msg for msg in result["messages"] if isinstance(msg, AIMessage)]
        if ai_messages:
            return ai_messages[-1].content
        return "I'm sorry, I couldn't generate a response."
    
    def reset_conversation(self):
        """Reset the conversation history"""
        self.conversation_state = {"messages": []}

    def chat_stream(self, user_input: str):
        """Yield the assistant response token-by-token.

        This method is a generator. Iterate over it to receive each new token
        (string) as soon as it's produced. The full answer is appended to the
        internal conversation state once streaming completes.
        """
        # Add the user's message
        self.conversation_state["messages"].append(HumanMessage(content=user_input))

        # Ensure system prompt is present
        self._ensure_system_prompt()

        # Prepare the model with streaming enabled
        llm = create_llm(stream=True)

        # Stream the response
        full_response_tokens: list[str] = []
        for chunk in llm.stream(self.conversation_state["messages"]):
            # Each chunk is a ChatMessage — accumulate and yield its content
            token = chunk.content or ""
            full_response_tokens.append(token)
            if token:
                yield token

        # After streaming ends, record the assistant message in full
        full_message = AIMessage(content="".join(full_response_tokens))
        self.conversation_state["messages"].append(full_message)

# Example usage and testing
def main():
    """Example usage of the chatbot"""
    print("LangGraph Chatbot with OpenAI GPT-4.1 (streaming demo)")
    print("Type 'quit' to exit, 'reset' to clear conversation history")
    print("-" * 50)
    
    # Create chatbot instance
    chatbot = LangGraphChatbot()
    
    while True:
        try:
            user_input = input("\nYou: ").strip()
            
            if user_input.lower() == 'quit':
                print("Goodbye!")
                break
            elif user_input.lower() == 'reset':
                chatbot.reset_conversation()
                print("Conversation history cleared!")
                continue
            elif not user_input:
                continue
            
            # Stream chatbot response token-by-token
            print("\nBot: ", end="", flush=True)
            for token in chatbot.chat_stream(user_input):
                print(token, end="", flush=True)
            print()  # newline after complete answer
            
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"\nError: {e}")
            print("Please make sure your OPENAI_API_KEY environment variable is set.")

if __name__ == "__main__":
    main()
