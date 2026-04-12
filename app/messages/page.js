"use client";

import { useState } from "react";
import Link from "next/link";

// Mock Data
const MOCK_CONTACTS = [
    { id: 1, name: "Arjun Mehta", role: "Tutor • Physics", lastMessage: "Yes, I can cover the mechanics chapter tomorrow.", time: "10:23 AM", unread: 2, avatar: "A", online: true },
    { id: 2, name: "Priya Sharma", role: "Student • Grade 10", lastMessage: "Thanks! What time works best?", time: "Yesterday", unread: 0, avatar: "P", online: false },
    { id: 3, name: "Rahul Verma", role: "Tutor • English", lastMessage: "I've attached the grammar worksheets.", time: "Mon", unread: 0, avatar: "R", online: true },
];

const MOCK_MESSAGES = [
    { id: 1, senderId: 1, text: "Hi! I saw you requested a trial class for CBSE Grade 12 Physics.", timestamp: "10:00 AM" },
    { id: 2, senderId: 'me', text: "Yes, exactly! I am struggling a bit with the new mechanics syllabus.", timestamp: "10:05 AM" },
    { id: 3, senderId: 1, text: "No worries at all. That's a very common area to get stuck. I have some great visual aids we can use.", timestamp: "10:15 AM" },
    { id: 4, senderId: 1, text: "Yes, I can cover the mechanics chapter tomorrow. Are you free around 6 PM?", timestamp: "10:23 AM" },
];

export default function MessagesPage() {
    const [selectedContact, setSelectedContact] = useState(MOCK_CONTACTS[0]);
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setMessages([...messages, {
            id: Date.now(),
            senderId: 'me',
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setNewMessage("");
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark font-sans flex flex-col pt-20">
            {/* Header Area */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-6 md:px-10 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">Messages</h1>
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">2 Unread</span>
                </div>
                <Link href="/dashboard" className="text-slate-500 hover:text-primary transition-colors flex items-center gap-2 text-sm font-bold">
                    <span className="material-symbols-outlined text-[20px]">dashboard</span>
                    Dashboard
                </Link>
            </div>

            {/* Main Chat Layout */}
            <div className="flex-1 flex overflow-hidden">

                {/* Sidebar (Contacts) */}
                <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 flex flex-col hidden md:flex">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                type="text"
                                placeholder="Search messages..."
                                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1 p-2">
                        {MOCK_CONTACTS.map(contact => (
                            <button
                                key={contact.id}
                                onClick={() => setSelectedContact(contact)}
                                className={`w-full text-left p-3 rounded-xl flex items-start gap-4 transition-all ${selectedContact.id === contact.id ? 'bg-primary/5 border border-primary/20 shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'}`}
                            >
                                <div className="relative">
                                    <div className="size-12 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center text-lg font-bold shadow-md">
                                        {contact.avatar}
                                    </div>
                                    {contact.online && <div className="absolute bottom-0 right-0 size-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className={`text-sm font-bold truncate pr-2 ${selectedContact.id === contact.id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{contact.name}</h3>
                                        <span className="text-xs text-slate-400 whitespace-nowrap">{contact.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate mb-1">{contact.role}</p>
                                    <div className="flex justify-between items-center">
                                        <p className={`text-sm truncate pr-4 ${contact.unread > 0 ? 'font-bold text-slate-800 dark:text-slate-200' : 'text-slate-500'}`}>{contact.lastMessage}</p>
                                        {contact.unread > 0 && (
                                            <span className="bg-primary text-white text-xs font-bold size-5 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/30">
                                                {contact.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                {selectedContact ? (
                    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-background-dark relative">
                        {/* Chat Header */}
                        <div className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shadow-sm z-10">
                            <div className="flex items-center gap-4">
                                <button className="md:hidden text-slate-500 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <div className="relative">
                                    <div className="size-10 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-bold shadow-md">
                                        {selectedContact.avatar}
                                    </div>
                                    {selectedContact.online && <div className="absolute bottom-0 right-0 size-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>}
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900 dark:text-white leading-tight">{selectedContact.name}</h2>
                                    <p className="text-xs text-emerald-500 font-medium">{selectedContact.online ? 'Online' : 'Offline'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Video Call">
                                    <span className="material-symbols-outlined text-[20px]">videocam</span>
                                </button>
                                <button className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="View Profile">
                                    <span className="material-symbols-outlined text-[20px]">info</span>
                                </button>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">

                            <div className="text-center">
                                <span className="text-xs font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
                            </div>

                            {messages.map(msg => {
                                const isMe = msg.senderId === 'me';
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                                        <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            <div className={`
                                                relative px-5 py-3.5 shadow-sm 
                                                ${isMe
                                                    ? 'bg-gradient-to-br from-primary to-primary-glow text-white rounded-[2rem] rounded-tr-sm shadow-primary/20'
                                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-[2rem] rounded-tl-sm border border-slate-100 dark:border-slate-700'}
                                            `}>
                                                <p className="text-[15px] leading-relaxed">{msg.text}</p>
                                            </div>
                                            <span className="text-xs text-slate-400 mt-1.5 px-2 flex items-center gap-1 font-medium">
                                                {msg.timestamp}
                                                {isMe && <span className="material-symbols-outlined text-[14px] text-primary">done_all</span>}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Message Input */}
                        <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-10">
                            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center">
                                <button type="button" className="absolute left-3 text-slate-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <span className="material-symbols-outlined">attach_file</span>
                                </button>

                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full pl-14 pr-16 py-4 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-inner"
                                />

                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className={`absolute right-2 size-10 rounded-full flex items-center justify-center transition-all ${newMessage.trim()
                                        ? 'bg-primary text-white hover:bg-primary-glow shadow-md shadow-primary/30 scale-100'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 scale-95 cursor-not-allowed'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">send</span>
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-background-dark">
                        <div className="size-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-slate-700 text-slate-300">
                            <span className="material-symbols-outlined text-5xl">forum</span>
                        </div>
                        <h2 className="text-2xl font-heading font-bold mb-2">Your Messages</h2>
                        <p className="text-slate-500 max-w-sm">Select a conversation from the sidebar to continue chatting or start a new match.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
