import React from "react";

import {  useTheme, useTranslation } from "../hooks/";
import { Block, Text } from "../components/";

const Home = () => {
  const {sizes} = useTheme();
  const {t} = useTranslation();
  return (
    <Block>
      <Text h2 margin={sizes.padding} align={"center"}>{t('home.title')}</Text>
      <Text h4 margin={sizes.padding} align={"center"}>{t('home.subTitle')}</Text>
      <Text p margin={sizes.padding} align={"center"}>
        {t('home.subDescription')}
      </Text>
    </Block>
  );
};

export default Home;
