"use client";
import React, { useState, useCallback, useMemo } from 'react'
import styles from '@/styles/RightSection.module.css'
import logo from '@/assets/logo.png'
import robo from '@/assets/robo.png'
import User from '@/assets/User.png'
import Image from 'next/image'
import { HashLoader } from 'react-spinners';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API;

const RightSection = () => {
    const trainingPrompt = useMemo(() => [
        {
            "role": "user",
            "parts": [{
                "text": "This is Introductory dialogue for any prompt : 'Hello, my dear friend, I am the BUDGETBOT. Ask me anything regarding BUDGET PLANNING AND BUDGET TRACKING. I will be happy to help you.'"
            }]
        },
        {
            "role": "model",
            "parts": [{
                "text": "okay"
            }]
        },
        {
            "role": "user",
            "parts": [{
                "text": "Special Dialogue 1 : if any prompt mentions 'Shashi Shahi' word : 'Ofcourse! Dr. Shashi Shahi is one of the prominent professors at UWindsor! He is an IIT-D alumni with year of invaluable experience and a fun way of engaging in lectures!' 'Likes: Analytics and Research and Case Studies ''Dislikes: Students near riverside.'"
            }]
        },
        {
            "role": "model",
            "parts": [{
                "text": "okay"
            }]
        },
        {
            "role": "user",
            "parts": [{
                "text": "Special Dialogue 2 : Any prompt that mentions BUDGETBOT class / classroom  A : ' The BUDGETBOT Batch of 2023 is by far the best the university has ever seen by all sets of standards. Students from different come together to form a truly diverse and culturally rich classroom experience. I believe that all students are highly capable and will achieve all great things in their professional career!'"
            }]
        },
        {
            "role": "model",
            "parts": [{
                "text": "okay"
            }]
        }
    ], []);

    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(true);
    const [allMessages, setAllMessages] = useState<any[]>([]);

    const sendMessage = useCallback(async () => {
        setIsSent(false);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
        
        const messagesToSend = [
            ...trainingPrompt,
            ...allMessages,
            {
                "role": "user",
                "parts": [{ "text": message }]
            }
        ];

        try {
            let res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "contents": messagesToSend })
            });
            let resjson = await res.json();
            let responseMessage = resjson.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond.";

            setAllMessages((prevMessages) => [
                ...prevMessages,
                { "role": "user", "parts": [{ "text": message }] },
                { "role": "model", "parts": [{ "text": responseMessage }] }
            ]);
        } catch (error) {
            console.error("Error fetching budgetbot response:", error);
        } finally {
            setIsSent(true);
            setMessage('');
        }
    }, [API_KEY, message, allMessages, trainingPrompt]);

    const handleCardClick = (text: string) => {
        setMessage(text);
    };

    const memoizedMessages = useMemo(() => {
        return allMessages.map((msg, index) => (
            <div key={index} className={styles.message}>
                <Image src={msg.role === 'user' ? User : robo} width={50} height={50} alt="" />
                <div className={styles.details}>
                    <h2>{msg.role === 'user' ? 'You' : 'BUDGETBOT'}</h2>
                    <p dangerouslySetInnerHTML={{ __html: msg.parts[0].text.replace(/\n/g, '<br />') }} />
                </div>
            </div>
        ));
    }, [allMessages]);

    return (
        <div className={styles.rightSection}>
            {/* <Image src={schoolbg} alt="" className={styles.schoolbg} /> */}
            <div className={styles.rightin}>
                {
                    allMessages.length > 0 ? (
                        <div className={styles.messages}>
                            {memoizedMessages}
                        </div>
                    ) : (
                        <div className={styles.nochat}>
                            <div className={styles.s1}>
                                <h1>How can I help you today?</h1>
                            </div>
                            <div className={styles.s2}>
                                {["Vacation & Travel 🏖✈", "Education (Courses, College Fees, Certifications) 🎓📚", "Buying a Vehicle (Car, Bike, etc.) 🚗🏍", "Home Purchase or Rent 🏡", "Monthly Expenses (Groceries, Utilities, etc.) 🛒💡", "Medical & Health Expenses 🏥💊", "Weddings & Celebrations 💍🎉", "Gadgets & Tech Upgrades 📱💻", "Investments & Savings (Stocks, Mutual Funds, etc.) 📈💰", "Festivals & Gifts 🎁🎄", "Starting a Business or Side Hustle 🚀💼", "Fitness & Gym Memberships 🏋‍♂", "Hobbies & Personal Development 🎨🎸", "Insurance (Health, Life, Vehicle, etc.) 📜🛡", "Emergency Fund Planning ⚠🏦"].map((suggestion, index) => (
                                    <div key={index} className={styles.suggestioncard} onClick={() => handleCardClick(suggestion)}>
                                        <h2>{suggestion}</h2>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }

                <div className={styles.bottomsection}>
                    <div className={styles.messagebar}>
                        <input
                            type='text'
                            placeholder='Message BUDGETBOT...'
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                        />
                        {
                            isSent ? (
                                <svg
                                    onClick={sendMessage}
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                </svg>
                            ) : (
                                <HashLoader color="#36d7b7" size={30} />
                            )
                        }
                    </div>
                    <p>BUDGETBOT can make mistakes. Consider checking important information.</p>
                </div>
            </div>
        </div>
    );
}

export default RightSection;
