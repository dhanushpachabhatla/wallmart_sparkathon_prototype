import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, MapPin, Plus, Navigation } from 'lucide-react';
import { ChatMessage, Product, StoreMapData } from '../types';
import { useApp } from '../contexts/AppContext';
import { generateResponse, isGeminiAvailable } from '../services/geminiService';

const WallyAIPage: React.FC = () => {
  const { addToCart, addToSmartList, smartLists, currentStore } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm WallyAI, your smart shopping assistant. I can help you find products, plan recipes, navigate the store, and much more. What can I help you with today?",
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'user',
      content: "I need to make apple pie today, list items and I'll see if to add to cart",
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: '3',
      type: 'ai',
      content: "Perfect! Here are the essential ingredients for a delicious homemade apple pie. I've found these items in our store with their locations:",
      timestamp: new Date(Date.now() - 240000),
      productCards: [
        {
          id: 'apple-1',
          title: 'Granny Smith Apples, 3 lb bag',
          price: 3.48,
          image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
          availability: 'in-stock' as const,
          aisle: '1',
          category: 'Produce'
        },
        {
          id: 'flour-1',
          title: 'All-Purpose Flour, 5 lb',
          price: 2.98,
          image: 'https://images.pexels.com/photos/1191408/pexels-photo-1191408.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
          availability: 'in-stock' as const,
          aisle: '6',
          category: 'Baking'
        },
        {
          id: 'butter-1',
          title: 'Unsalted Butter, 1 lb',
          price: 4.68,
          image: 'https://images.pexels.com/photos/248444/pexels-photo-248444.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
          availability: 'in-stock' as const,
          aisle: '12',
          category: 'Dairy'
        },
        {
          id: 'sugar-1',
          title: 'Granulated Sugar, 4 lb',
          price: 2.48,
          image: 'https://images.pexels.com/photos/1191408/pexels-photo-1191408.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
          availability: 'in-stock' as const,
          aisle: '6',
          category: 'Baking'
        },
        {
          id: 'cinnamon-1',
          title: 'Ground Cinnamon',
          price: 1.98,
          image: 'https://images.pexels.com/photos/4110552/pexels-photo-4110552.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
          availability: 'in-stock' as const,
          aisle: '6',
          category: 'Spices'
        }
      ]
    },
    {
      id: '4',
      type: 'user',
      content: "I'm in store, want to make apple pie today, what ingredients should I have? Show me directions",
      timestamp: new Date(Date.now() - 180000)
    },
    {
      id: '5',
      type: 'ai',
      content: "Great! Since you're in the store, I'll show you exactly where to find each apple pie ingredient. Here's your optimized shopping route:",
      timestamp: new Date(Date.now() - 120000),
      productCards: [
        {
          id: 'apple-2',
          title: 'Granny Smith Apples, 3 lb bag',
          price: 3.48,
          image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
          availability: 'in-stock' as const,
          aisle: '1',
          category: 'Produce'
        },
        {
          id: 'flour-2',
          title: 'All-Purpose Flour, 5 lb',
          price: 2.98,
          image: 'https://images.pexels.com/photos/1191408/pexels-photo-1191408.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
          availability: 'in-stock' as const,
          aisle: '6',
          category: 'Baking'
        },
        {
          id: 'butter-2',
          title: 'Unsalted Butter, 1 lb',
          price: 4.68,
          image: 'https://images.pexels.com/photos/248444/pexels-photo-248444.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
          availability: 'in-stock' as const,
          aisle: '12',
          category: 'Dairy'
        }
      ],
      mapData: {
        storeId: currentStore?.id || '1',
        layout: 'standard',
        items: [
          { productId: 'apple-2', aisle: '1', coordinates: { x: 20, y: 30 } },
          { productId: 'flour-2', aisle: '6', coordinates: { x: 60, y: 40 } },
          { productId: 'butter-2', aisle: '12', coordinates: { x: 80, y: 70 } }
        ],
        userLocation: { x: 10, y: 10 },
        path: [
          { x: 10, y: 10 },
          { x: 20, y: 30 },
          { x: 60, y: 40 },
          { x: 80, y: 70 }
        ]
      }
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const mockResponses = {
    'chocolate ice cream': {
      content: "I'd love to help you make chocolate ice cream! Here are the ingredients you'll need and where to find them in the store:",
      products: [
        {
          id: 'icecream-1',
          title: 'Heavy Whipping Cream, 1 pt',
          price: 3.48,
          image: 'https://images.pexels.com/photos/248444/pexels-photo-248444.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
          availability: 'in-stock' as const,
          aisle: '12',
          category: 'Dairy'
        },
        {
          id: 'icecream-2',
          title: 'Unsweetened Cocoa Powder',
          price: 2.98,
          image: 'https://images.pexels.com/photos/2180187/pexels-photo-2180187.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
          availability: 'in-stock' as const,
          aisle: '6',
          category: 'Baking'
        },
        {
          id: 'icecream-3',
          title: 'Pure Vanilla Extract',
          price: 4.68,
          image: 'https://images.pexels.com/photos/4110552/pexels-photo-4110552.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
          availability: 'in-stock' as const,
          aisle: '6',
          category: 'Baking'
        },
        {
          id: 'icecream-4',
          title: 'Granulated Sugar, 4 lb',
          price: 2.48,
          image: 'https://images.pexels.com/photos/1191408/pexels-photo-1191408.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
          availability: 'in-stock' as const,
          aisle: '6',
          category: 'Baking'
        }
      ],
      mapData: {
        storeId: currentStore?.id || '1',
        layout: 'standard',
        items: [
          { productId: 'icecream-1', aisle: '12', coordinates: { x: 50, y: 80 } },
          { productId: 'icecream-2', aisle: '6', coordinates: { x: 30, y: 40 } },
          { productId: 'icecream-3', aisle: '6', coordinates: { x: 35, y: 40 } },
          { productId: 'icecream-4', aisle: '6', coordinates: { x: 25, y: 40 } }
        ],
        userLocation: { x: 10, y: 10 },
        path: [
          { x: 10, y: 10 },
          { x: 25, y: 40 },
          { x: 35, y: 40 },
          { x: 50, y: 80 }
        ]
      }
    },
    'healthy breakfast': {
      content: "Here are some great healthy breakfast options available in the store:",
      products: [
        {
          id: 'breakfast-1',
          title: 'Greek Yogurt, Plain, 32 oz',
          price: 4.98,
          image: 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
          availability: 'in-stock' as const,
          aisle: '12',
          category: 'Dairy'
        },
        {
          id: 'breakfast-2',
          title: 'Fresh Blueberries, 1 pint',
          price: 3.48,
          image: 'https://images.pexels.com/photos/139751/pexels-photo-139751.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
          availability: 'in-stock' as const,
          aisle: '1',
          category: 'Produce'
        }
      ]
    }
  };

  const generateAIResponse = (userMessage: string): Partial<ChatMessage> => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('apple pie')) {
      if (lowerMessage.includes('directions') || lowerMessage.includes('in store')) {
        return {
          content: "Perfect! Since you're in the store, here's your optimized route to collect all apple pie ingredients. Follow the blue path on the map below:",
          products: [
            {
              id: 'apple-route',
              title: 'Granny Smith Apples, 3 lb bag',
              price: 3.48,
              image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
              availability: 'in-stock' as const,
              aisle: '1',
              category: 'Produce'
            },
            {
              id: 'flour-route',
              title: 'All-Purpose Flour, 5 lb',
              price: 2.98,
              image: 'https://images.pexels.com/photos/1191408/pexels-photo-1191408.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
              availability: 'in-stock' as const,
              aisle: '6',
              category: 'Baking'
            }
          ],
          mapData: {
            storeId: currentStore?.id || '1',
            layout: 'standard',
            items: [
              { productId: 'apple-route', aisle: '1', coordinates: { x: 20, y: 30 } },
              { productId: 'flour-route', aisle: '6', coordinates: { x: 60, y: 40 } }
            ],
            userLocation: { x: 10, y: 10 },
            path: [
              { x: 10, y: 10 },
              { x: 20, y: 30 },
              { x: 60, y: 40 }
            ]
          }
        };
      } else {
        return {
          content: "Here are the essential ingredients for a delicious apple pie! Would you like me to add these to your cart?",
          products: [
            {
              id: 'apple-list',
              title: 'Granny Smith Apples, 3 lb bag',
              price: 3.48,
              image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
              availability: 'in-stock' as const,
              aisle: '1',
              category: 'Produce'
            },
            {
              id: 'flour-list',
              title: 'All-Purpose Flour, 5 lb',
              price: 2.98,
              image: 'https://images.pexels.com/photos/1191408/pexels-photo-1191408.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
              availability: 'in-stock' as const,
              aisle: '6',
              category: 'Baking'
            }
          ]
        };
      }
    } else if (lowerMessage.includes('chocolate ice cream') || lowerMessage.includes('ice cream')) {
      return mockResponses['chocolate ice cream'];
    } else if (lowerMessage.includes('healthy') || lowerMessage.includes('breakfast')) {
      return mockResponses['healthy breakfast'];
    } else if (lowerMessage.includes('where') || lowerMessage.includes('find')) {
      return {
        content: `I can help you find that! ${currentStore?.name} has a well-organized layout. What specific product are you looking for?`
      };
    } else {
      return {
        content: "I'm here to help! You can ask me about:\n• Finding specific products\n• Recipe ingredients and locations\n• Store navigation\n• Product recommendations\n• Price comparisons\n\nWhat would you like to know?"
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText(''); 
    setIsLoading(true);

    try {
      let aiResponse: Partial<ChatMessage>;
      
      // Try Gemini API first if available
      if (isGeminiAvailable()) {
        try {
          const geminiResponse = await generateResponse(currentInput);
          aiResponse = {
            content: geminiResponse.text,
            products: geminiResponse.products?.map(p => ({
              id: `gemini-${Date.now()}-${Math.random()}`,
              title: p.name,
              price: p.price || 2.99,
              image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
              availability: 'in-stock' as const,
              aisle: p.aisle || '1',
              category: p.category
            }))
          };
        } catch (error) {
          console.error('Gemini API failed, using fallback:', error);
          aiResponse = generateAIResponse(currentInput);
        }
      } else {
        // Use mock responses
        aiResponse = generateAIResponse(currentInput);
      }
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content || "I'm sorry, I couldn't understand that. Can you please rephrase?",
        timestamp: new Date(),
        productCards: aiResponse.products,
        mapData: aiResponse.mapData
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble processing your request right now. Please try again in a moment!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // In a real app, this would start/stop speech recognition
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputText("I want to make chocolate ice cream today");
      }, 3000);
    }
  };

  const handleAddAllToCart = (products: Product[]) => {
    products.forEach(product => addToCart(product));
  };

  const handleAddAllToList = (products: Product[]) => {
    if (smartLists.length > 0) {
      products.forEach(product => addToSmartList(smartLists[0].id, product));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8 lg:pl-64 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">WallyAI Assistant</h1>
              <p className="text-gray-600">Your smart shopping companion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`p-4 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-[#0071ce] text-white ml-4' 
                    : 'bg-white shadow-sm border border-gray-200 mr-4'
                }`}>
                  <p className="whitespace-pre-line">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>

                {/* Product Cards */}
                {message.productCards && (
                  <div className="mt-4 mr-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {message.productCards.map((product) => (
                        <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{product.title}</h4>
                              <p className="text-[#0071ce] font-bold">${product.price.toFixed(2)}</p>
                              <p className="text-xs text-gray-500">Aisle {product.aisle}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <button
                              onClick={() => addToCart(product)}
                              className="flex-1 px-3 py-1 bg-[#0071ce] text-white rounded text-sm hover:bg-blue-700 transition-colors"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => smartLists.length > 0 && addToSmartList(smartLists[0].id, product)}
                              className="flex-1 px-3 py-1 border border-[#0071ce] text-[#0071ce] rounded text-sm hover:bg-blue-50 transition-colors"
                            >
                              Add to List
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {message.productCards.length > 1 && (
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => handleAddAllToCart(message.productCards!)}
                          className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add All to Cart</span>
                        </button>
                        <button
                          onClick={() => handleAddAllToList(message.productCards!)}
                          className="flex items-center space-x-1 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add All to List</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Store Map */}
                {message.mapData && (
                  <div className="mt-4 mr-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="w-5 h-5 text-[#0071ce]" />
                      <h4 className="font-medium text-gray-900">Store Navigation</h4>
                    </div>
                    
                    <div className="relative bg-gray-100 rounded-lg h-48 mb-3">
                      {/* Simple store layout visualization */}
                      <div className="absolute inset-4">
                        {/* Store entrance */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-green-500 rounded-t">
                          <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-green-600 font-bold">
                            ENTRANCE
                          </span>
                        </div>
                        
                        {/* Aisles */}
                        <div className="absolute top-4 left-8 w-2 h-12 bg-gray-400 rounded">
                          <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-bold">1</span>
                        </div>
                        <div className="absolute top-4 left-20 w-2 h-12 bg-gray-400 rounded">
                          <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-bold">6</span>
                        </div>
                        <div className="absolute top-4 right-8 w-2 h-12 bg-gray-400 rounded">
                          <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-bold">12</span>
                        </div>
                        
                        {/* Navigation path */}
                        {message.mapData.path && message.mapData.path.length > 1 && (
                          <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <path
                              d={`M ${message.mapData.path.map(point => `${point.x}% ${point.y}%`).join(' L ')}`}
                              stroke="#0071ce"
                              strokeWidth="3"
                              strokeDasharray="5,5"
                              fill="none"
                              className="animate-pulse"
                            />
                          </svg>
                        )}
                        
                        {/* Product locations */}
                        {message.mapData.items.map((item, index) => (
                          <div
                            key={item.productId}
                            className="absolute w-3 h-3 bg-[#0071ce] rounded-full"
                            style={{
                              left: `${item.coordinates.x}%`,
                              top: `${item.coordinates.y}%`
                            }}
                            title={`Aisle ${item.aisle}`}
                          >
                            <span className="absolute -top-6 -left-2 text-xs font-bold text-[#0071ce]">
                              {index + 1}
                            </span>
                          </div>
                        ))}
                        
                        {/* User location */}
                        {message.mapData.userLocation && (
                          <div
                            className="absolute w-4 h-4 bg-green-500 rounded-full"
                            style={{
                              left: `${message.mapData.userLocation.x}%`,
                              top: `${message.mapData.userLocation.y}%`
                            }}
                            title="You are here"
                          >
                            <span className="absolute -top-6 -left-3 text-xs font-bold text-green-600">
                              YOU
                            </span>
                            <div className="absolute -top-1 -left-1 w-6 h-6 bg-green-500 bg-opacity-30 rounded-full animate-ping"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Estimated walk time: {message.mapData.items.length * 2}-{message.mapData.items.length * 3} minutes
                      </p>
                      <button className="flex items-center space-x-1 px-3 py-1 bg-[#0071ce] text-white rounded text-sm hover:bg-blue-700 transition-colors">
                        <Navigation className="w-4 h-4" />
                        <span>Start Navigation</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-4 mr-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleVoiceToggle}
              className={`p-3 rounded-full transition-colors ${
                isListening 
                  ? 'bg-red-100 text-red-600 animate-pulse' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isListening ? "Listening..." : "Try: 'I need apple pie ingredients' or 'Show me directions to dairy aisle'"}
              disabled={isListening}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0071ce] focus:border-transparent disabled:bg-gray-50"
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="p-3 bg-[#0071ce] text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WallyAIPage;