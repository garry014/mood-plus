-- USER ACCOUNTS
INSERT INTO `moodplusdb`.`users` (`id`, `firstname`, `lastname`, `username`, `password`, `gender`, `email`, `phoneno`, `usertype`, `chat`) VALUES ('100', 'Tom', 'Poo', 'customer1', '$2b$10$BeXwap/SH5yk/DQpq3dZyeVyhb8IJCo2IY4z.o0ezMK0RFXd3aYuy', 'male', 'tomlow@gmail.com', '81234567', 'customer', 'Hidden');
INSERT INTO `moodplusdb`.`users` (`id`, `firstname`, `lastname`, `username`, `password`, `gender`, `email`, `phoneno`, `usertype`, `chat`) VALUES ('101', 'Xin En', 'Toh', 'customer2', '$2b$10$BeXwap/SH5yk/DQpq3dZyeVyhb8IJCo2IY4z.o0ezMK0RFXd3aYuy', 'female', 'xinen@gmail.com', '85479654', 'customer', 'Hidden');
INSERT INTO `moodplusdb`.`users` (`id`, `firstname`, `lastname`, `username`, `password`, `gender`, `email`, `phoneno`, `usertype`) VALUES ('102', 'Wendy', 'Tan', 'counsellor1', '$2b$10$dcAa2kDQZ3/Rn/rMNzRBhe8gBqnonfn1fhwxmLB4fdL7H70zl6N66', 'female', 'wendy@gmail.com', '84951432', 'counsellor');
INSERT INTO `moodplusdb`.`users` (`id`, `firstname`, `lastname`, `username`, `password`, `gender`, `email`, `phoneno`, `usertype`) VALUES ('103', 'Tobias', 'Wee', 'counsellor2', '$2b$10$dcAa2kDQZ3/Rn/rMNzRBhe8gBqnonfn1fhwxmLB4fdL7H70zl6N66', 'female', 'wendy@gmail.com', '84951432', 'counsellor');
INSERT INTO `moodplusdb`.`users` (`id`, `firstname`, `lastname`, `username`, `password`, `gender`, `email`, `phoneno`, `usertype`) VALUES ('104', 'Admin', 'Admin', 'admin1', '$2b$10$dcAa2kDQZ3/Rn/rMNzRBhe8gBqnonfn1fhwxmLB4fdL7H70zl6N66', 'female', 'admin@gmail.com', '91234567', 'admin');

-- THREADS
INSERT INTO `moodplusdb`.`threads` (`id`, `title`, `post`, `summary`, `username`, `usertype`, `category`, `timestamp`, `hiddenReason`, `isClosed`, `isPinned`) VALUES ('100', 'Sisters death', '<p>Cant believe my beautiful sister passed away a few hours ago ,finding it so hard to sleep,so many thoughts going through my head. In 3 years I\'ve lost three sisters ,why cant god give us a break ,</p>', 'Cant believe my beautiful sister passed away a few hours ago ,finding it so hard to sleep,so many thoughts going through my head. In 3 years I\'ve lost three sisters ,why cant god give us a break ,', 'customer2', 'customer', 'Grief', '13 February 2023 7:56 PM', '', '0', '0');
INSERT INTO `moodplusdb`.`threads` (`id`, `title`, `post`, `summary`, `username`, `usertype`, `category`, `timestamp`, `hiddenReason`, `isClosed`, `isPinned`) VALUES ('101', 'Incident during therapy has really thrown me...what should I do? (TW - sexual abuse.)', '<p><font color=\"#212529\"><span style=\"font-size: 15px;\">Hi, Im new here, wasn\'t sure what forum to post this on since it touches on a number of issues, so apologies if it\'s the wrong one.</span></font></p><p><font color=\"#212529\"><span style=\"font-size: 15px;\"><br></span></font></p><p><font color=\"#212529\"><span style=\"font-size: 15px;\">I have a substance abuse problem, probably due to PTSD from a childhood that featured domestic violence, neglect and sexual abuse. I\'m currently having a new-ish type of intensive therapy for the substance abuse. It involves being given psycho-active drugs to facilitate the therapy process. Regular blood pressure checks are taken during the drug sessions to keep an eye on the client while they are under the influence.</span></font></p><p><font color=\"#212529\"><span style=\"font-size: 15px;\"><br></span></font></p><p><font color=\"#212529\"><span style=\"font-size: 15px;\">Last week, I had a drug session. As I was coming round I heard my usual nurse ask another to take my BP because she was busy. The new nurse was male. As he took my BP he managed to touch my breast twice, once on the side which I kind of ignored, and then again on top (my nipple area.) My alarm bells kicked off the second time. My arm was laid beside me so nowhere near my nipple area. I was way too groggy to say anything, he didn\'t say anything either, and that was that.</span></font></p><p><font color=\"#212529\"><span style=\"font-size: 15px;\"><br></span></font></p><p><font color=\"#212529\"><span style=\"font-size: 15px;\">Having mentioned it to people since, several have just dismissed it as a non issue eg. oh don\'t fuss, men have big hands, these things happen. However, I think it was deliberate - in which case that male nurse is working in a facility where he has ready access to vulnerable women. If it was accidental, I still think its crap - he works with women with mental health issues, many of whom would have suffered sexual abuse, can he really not manage to be careful enough not to touch their breasts?</span></font></p><p><font color=\"#212529\"><span style=\"font-size: 15px;\"><br></span></font></p><p><font color=\"#212529\"><span style=\"font-size: 15px;\">Since the incident I have suffered relentless intrusive thoughts about other occasions when I have been groped/touched/assaulted. I have also become intensely anxious about what to do. I am due back for another session this coming week. I feel more screwed up now than before I started. Where do I go from here? Any advice welcome.</span></font></p><p><br></p>', '\n\nI have a substance abuse problem, probably due to PTSD from a childhood that featured domestic violence, neglect and sexual abuse. I\'m currently having a new-ish type of intensive therapy for the substance abuse. It involves being given psycho-active', 'customer1', 'customer', 'Abuse', '13 February 2023 8:00 PM', '', '0', '0');

-- POSTS
INSERT INTO `moodplusdb`.`posts` (`id`, `post`, `username`, `usertype`, `timestamp`, `hiddenReason`, `threadId`) VALUES ('100', '<p>So sorry. How old was your sister?&nbsp;I lost my mom and dad 3 weeks apart in 1990 after an illness my mom had and my dad just went to sleep didn\'t wake up They were very close</p>', 'counsellor1', 'counsellor', '13 February 2023 10:14 PM', '', '100');
INSERT INTO `moodplusdb`.`posts` (`id`, `post`, `username`, `usertype`, `timestamp`, `hiddenReason`, `threadId`) VALUES ('101', '<p>She fell over ,not quite sure of all details ,just an unexpected call to say the paramedics were with her giving her CPR.</p>', 'customer2', 'customer', '13 February 2023 10:16 PM', '', '100');
INSERT INTO `moodplusdb`.`posts` (`id`, `post`, `username`, `usertype`, `timestamp`, `hiddenReason`, `threadId`) VALUES ('102', '<p>I\'m sorry for your loss, life is so cruel</p>', 'customer1', 'customer', '13 February 2023 10:17 PM', '', '100');
INSERT INTO `moodplusdb`.`posts` (`id`, `post`, `username`, `usertype`, `timestamp`, `hiddenReason`, `threadId`) VALUES ('103', '<p>3 wonderful kids , heart broken for them</p>', 'counsellor2', 'customer', '13 February 2023 10:20 PM', '', '100');
INSERT INTO `moodplusdb`.`posts` (`id`, `post`, `username`, `usertype`, `timestamp`, `hiddenReason`, `threadId`) VALUES ('104', '<p>Did she passed on peacefully at home?</p>', 'counsellor1', 'counsellor', '13 February 2023 10:24 PM', '', '100');
INSERT INTO `moodplusdb`.`posts` (`id`, `post`, `username`, `usertype`, `timestamp`, `hiddenReason`, `threadId`) VALUES ('105', '<p>Yes she was at home , she looked so peaceful.</p>', 'customer2', 'customer', '13 February 2023 10:58 PM', '', '100');
INSERT INTO `moodplusdb`.`posts` (`id`, `post`, `username`, `usertype`, `timestamp`, `hiddenReason`, `threadId`) VALUES ('106', '<p>Both my parents drank my sister a serious alcoholic died at age 66 heart attack</p>', 'customer1', 'customer', '13 February 2023 11:01 PM', '', '100');

--FEEDBACKS
INSERT INTO `moodplusdb`.`feedbacks` (`id`, `title`, `name`, `email`, `aifunction`, `satisfaction`, `description`, `timestamp`, `classification`) VALUES ('100', 'Chatbot is well done!', 'Tom Poo', 'tomlow@gmail.com', 'Chatbot', '5', 'I love the chatbot function! I could chat with it whenever I feel lonely or just need someone to talk to, just feels like I am actually having a conversation with a human.', '12 February 2023 11.34 PM', 'Positive');
INSERT INTO `moodplusdb`.`feedbacks` (`id`, `title`, `name`, `email`, `aifunction`, `satisfaction`, `description`, `timestamp`, `classification`) VALUES ('101', 'What is wrong with the Risk Assessment?', 'John Lim', 'johnlim@gmail.com', 'Risk Assessment', '1', 'Bad prediction! Why did it detect that I have a high suicidal rate when I feel fine?? I do not have depression!', '12 February 2023 11.34 PM', 'Negative');
INSERT INTO `moodplusdb`.`feedbacks` (`id`, `title`, `name`, `email`, `aifunction`, `satisfaction`, `description`, `timestamp`, `classification`) VALUES ('102', 'Chatbot was not accurate', 'Xi En Toh', 'xinen@gmail.com', 'Chatbot', '3', 'Some of the chatbot responses were not accurate but overall its a good feature.', '12 February 2023 4.26 PM', 'Constructive');
INSERT INTO `moodplusdb`.`feedbacks` (`id`, `title`, `name`, `email`, `aifunction`, `satisfaction`, `description`, `timestamp`, `classification`) VALUES ('103', 'HELLO', '', 'tomlow@gmail.com', 'Chatbot', '2', '????', '13 February 2023 10.58 PM', 'Irrelevant');

--CHATS
INSERT INTO `moodplusdb`.`chats` (`id`, `sender`, `recipient`, `sendername`, `recipientname`) VALUES ('2', 'customer2', 'counsellor1', 'Xin En Toh', 'Wendy Tan');

--MESSAGES
INSERT INTO `moodplusdb`.`messages` (`id`, `sentby`, `timestamp`, `message`, `chatId`) VALUES ('100', 'customer2', '13 February 2023 3.23 PM', 'hi', '2');
INSERT INTO `moodplusdb`.`messages` (`id`, `sentby`, `timestamp`, `message`, `chatId`) VALUES ('101', 'counsellor1', '13 February 2023 3.24 PM', 'Hello! I am a counsellor, my name is Wendy, how can I help you today?', '2');
INSERT INTO `moodplusdb`.`messages` (`id`, `sentby`, `timestamp`, `message`, `chatId`) VALUES ('102', 'customer2', '13 February 2023 3.46 PM', 'I have been feeling very down these days. I just do not really see a point in life anymore.', '2');
INSERT INTO `moodplusdb`.`messages` (`id`, `sentby`, `timestamp`, `message`, `chatId`) VALUES ('103', 'counsellor1', '13 February 2023 3.47 PM', 'Would you like to share with me about the problems might have or what do you think made you feel this way?', '2');
INSERT INTO `moodplusdb`.`messages` (`id`, `sentby`, `timestamp`, `message`, `chatId`) VALUES ('103', 'counsellor1', '13 February 2023 3.47 PM', 'It is okay if you are not sure how to explain yourself, I am here to help you!', '2');

--EMOTION QUOTES
INSERT INTO moodplusdb.emotionquotes (
    happy,
    sad,
    neutral,
    angry,
    fear
)
VALUES
    (
        '"Happiness depends upon ourselves." —Aristotle',
        '“Cheer up when the night comes, because mornings always give you another chance.”',
        '"Your body must become familiar with its death - in all its possible forms and degrees - as a self-evident, imminent, and emotionally neutral step on the way towards the goal you have found worthy of your life." -Dag Hammarskjold',
        '“It is not the actions of others which trouble us, but rather it is our own judgments. Therefore remove those judgments and resolve to let go of your anger, and it will already be gone.” – Marcus Aurelius, Meditations',
        '“It’s perfectly okay to admit you’re not okay.” – Unknown'
    ),
    (
		'"Happiness is when what you think, what you say, and what you do are in harmony." —Mahatma Gandhi',
        '“Let us be of cheer, remembering that the misfortunes hardest to bear are those which never come.”',
        '"I`m not saying that people should stop flying. I`m just saying it needs to be easier to be climate neutral. -Greta Thunburg',
        '“You are not the anger, you are the awareness behind the anger. Realize this and the anger will no longer control you.” – Eckhart Tolle, The Power of Now',
        '“Let your mind and heart rest for a while. You will catch up, the world will not stop spinning for you, but you will catch up. Take a rest.” – Cynthia Go'
    ),
    (
		'"The moments of happiness we enjoy take us by surprise. It is not that we seize them, but that they seize us." —Ashley Montagu',
        '“I’ve got a lot of dreams I want to achieve, and I hope someone can cheer me on as I’ll cheer them on in their dreams.”',
        '"The Constitution is not neutral. It was designed to take the government off the backs of people." -William O. Douglas',
        '“Patience and empathy are anger’s mortal enemies.” – Gary Rudz',
        '“Stress is self-created, I decided to stop manufacturing it. We can choose an internal calm and joy even amid the chaos.” – Brendon Burchard'
    ),
   (
		'"Even if happiness forgets you a little bit, never completely forget about it." —Jaques Prevert',
       '“Life is too short for us to dwell on sadness. Cheer up and live life to the fullest.”',
        '"I can never really remember what I look like. I`m just sort of neutral. I don`t think I`m sort of, you know, hideous." -Sam Neill',
        '“Conquer the angry one by not getting angry; conquer the wicked by goodness; conquer the stingy by generosity, and the liar by speaking the truth.” ― Siddhārtha Gautama, Verse 223, The Dhammapada',
        '“Your mountain may be harder to climb, but oh the view is divine.” – Jennae Cecelia'
    ),
    (
		'"One of the secrets of a happy life is continuous small treats." —Iris Murdoch',
        '“Hands-on your hips, a smile on your lips, spirit in your heart, we’re ready to start!”',
        '"It`s really easy to get colors right. It`s really hard to get black and neutrals right. Black is certainly a color but it`s also an illusion."  -Donna Karan',
        '“Don’t hold to anger, hurt or pain. They steal your energy and keep you from love.” – Leo Buscaglia',
        '“Whatever you do, never run back to what broke you.” – Frank Ocean'
    ),
    (
		'"The only joy in the world is to begin." —Cesare Pavese',
		'“You don’t always need a plan. Sometimes you just need to breathe, trust, let go and see what happens.”',
        '"People who demand neutrality in any situation are usually not neutral but in favor of the status quo." —Max Eastman',
        '“The best fighter is never angry.” ― Lao Tzu',
        '“Change is hard at first, messy in the middle, and gorgeous at the end.” – Robin Sharma'
    ),
    (
		'"It is only possible to live happily ever after on a daily basis." —Margaret Bonanno',
        '“Tough times don’t last, tough people, do.”',
        '"Let`s not confuse traditional behaviours with good manners. The definition of etiquette is gender neutral - it simply means we strive at all times to ensure a person in our company feels at ease." -Lynn Coady',
        '“Holding on to anger is like grasping a hot coal with the intent of throwing it at someone else; you are the one who gets burned.” – Buddha',
        '“She’s hurt mentally and emotionally. But everyday, she walks with a smile. ‘Cause that’s who she is: the girl who never stopped smiling.” – Unknown'
    ),
    (
		'"The pleasure which we most rarely experience gives us greatest delight." —Epictetus',
        'Every day may not be good. But there is something good in every day',
        '"Nature is neutral." - Adlai Stevenson I',
        '“Calm is the best revenge.” – Bangambiki Habyarimana',
        '“All I want is a clear mind and a happy heart.” – Dipti Bhoyar'
    ),
    (
		'"Remember this, that very little is needed to make a happy life." — Marcus Aurelius',
        '"Do not grieve. Anything you lose comes round in another form."',
        '"Neutral men are the devil`s allies." - Edwin Hubbel Chapin',
        '“Do not let your anger lead to hatred, as you will hurt yourself more than you would the other.” – Stephen Richards, Cosmic Ordering Guide',
        '“Mantra for Anxiety: This is not you. This is something moving through you. It can leave out of the same door it came in.” – James Clear'
    ),
    (
		'"I wake up every morning with a great desire to live joyfully." — Anna Howard Shaw',
        '“It’s just a bad day not a bad life.”',
        '"If you are neutral in situations of injustice, you have chosen the side of the oppressor. If an elephant has its foot on the tail of a mouse and you say that you are neutral, the mouse will not appreciate your neutrality." - Desmond Tutu',
        '“When angry, count ten before you speak; if very angry, a hundred.” ― Thomas Jefferson',
        '“She has been through hell. So believe me when I say, fear her when she looks into a fire and smiles.” – E. Corona'
    );
