import dayjs from "dayjs";
import { Platform, StyleSheet } from "react-native";
import React, { useCallback, useState } from "react";
import {
  GiftedChat,
  Composer,
  Bubble,
  InputToolbar
} from "react-native-gifted-chat";

const JACUser = {
  id: 2,
  name: "JAC",
  department: "Department of Intelligence",
  stats: { posts: 0, followers: 0, following: 0 },
  social: { twitter: "ROBOTS", dribbble: "ROBOTS" },
  about:
    "JARVIS inspired AI ChatBot",
  avatar:
    "https://res.cloudinary.com/ddz7abcyq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1742348039/k-2so-4169866_id4dsu.jpg"
};

const chatUser = {
  id: 1,
  name: "Derek Vance",
  department: "Engineering",
  stats: { posts: 0, followers: 0, following: 0 },
  social: {},
  about:
    "Full Stack Engineer",
  avatar:
    "https://res.cloudinary.com/ddz7abcyq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1742348178/programmer-4709802_kzazw6.jpg"
};

import { Block, Button, Text } from "../components/";
import { useTheme, useTranslation } from "../hooks/";

const JAC = () => {
  const apiKey = process.env.OPEN_AI;
  const { t, locale } = useTranslation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{
    _id: 1,
    text: "Hey there! Ask Away!",
    createdAt: dayjs().toDate(),
    user: {
      _id: JACUser.id,
      name: JACUser.name,
      avatar: JACUser.avatar
    }
  }]);
  const { colors, gradients, sizes } = useTheme();
  const handleSend = useCallback(
    async (messages = []) => {
      if (!messages.length) return;


      setMessages((state) => GiftedChat.append(state, messages));
      setMessage("");
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: messages,
            max_tokens: 100,
            temperature: 0.7
          })
        });

        const data = await response.json();
        console.log("data", data);
        if (data.choices && data.choices.length > 0) {
          const botMessage = {

            _id: dayjs().unix(),
            text: data.choices[0].message.content,
            createdAt: dayjs().toDate(),
            user: {
              _id: JACUser.id,
              name: JACUser.name,
              avatar: JACUser.avatar
            }
          };

          setMessages((prevMessages) => [...prevMessages, botMessage]);
        }
      } catch (error) {
        console.error("Error fetching AI response:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {

            _id: dayjs().unix(),
            text: "Something went wrong. Try again!",
            createdAt: dayjs().toDate(),
            user: {
              _id: JACUser.id,
              name: JACUser.name,
              avatar: JACUser.avatar
            }
          }
        ]);
      }

    },
    [setMessages, setMessage]
  );

  return (
    <Block paddingHorizontal={sizes.s}>
      <GiftedChat
        alignTop
        text={message}
        showUserAvatar
        locale={locale}
        renderAvatarOnTop
        messages={messages}
        bottomOffset={-sizes.m}
        placeholder={t("common.message")}
        onSend={(messages) => handleSend(messages)}
        user={{ _id: chatUser.id, name: chatUser?.name, avatar: chatUser?.avatar }}
        onInputTextChanged={(text) => setMessage(text)}
        renderComposer={(props) => (
          <Composer
            {...props}
            textInputStyle={{
              color: colors.input,
              paddingTop: Platform.OS === "android" ? 0 : sizes.s
            }}
          />
        )}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            optionTintColor={String(colors.input)}
            containerStyle={{
              paddingTop: 0,
              marginTop: 0,
              marginBottom: sizes.l,
              borderColor: colors.gray,
              borderRadius: sizes.inputRadius,
              borderWidth: StyleSheet.hairlineWidth,
              backgroundColor: "transparent"
            }}
            renderSend={({ text }) => {
              if (text?.length === 0) {
                return null;
              }

              return (
                <Button
                  gradient={gradients.primary}
                  onPress={() => {
                    console.log(text, chatUser.avatar);
                    handleSend([
                      {
                        _id: dayjs().unix(),
                        text,
                        createdAt: dayjs().subtract(1, "m").toDate(),
                        user: {
                          _id: chatUser.id,
                          name: chatUser.name,
                          avatar: chatUser.avatar
                        }
                      }
                    ]);
                  }
                  }>
                  <Text
                    semibold
                    marginHorizontal={sizes.m}
                    transform="uppercase">
                    {t("common.send")}
                  </Text>
                </Button>
              );
            }}
          />
        )}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: { backgroundColor: "transparent" },
              right: { backgroundColor: "transparent" }
            }}
          />
        )}
        renderTime={(props) => (
          <Text size={12}>
            {dayjs(props?.currentMessage?.createdAt).format("HH:mm A")}
          </Text>
        )}
        renderMessageText={(props) => {
          const isMine = props?.currentMessage?.user?._id === chatUser?.id;
          return (
            <Block card flex={0} black={isMine}>
              <Text white={isMine}>{props?.currentMessage?.text}</Text>
            </Block>
          );
        }}
      />
    </Block>
  );
};

export default JAC;
