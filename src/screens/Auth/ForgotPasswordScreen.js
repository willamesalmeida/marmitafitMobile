import React from "react";
import {View, Text, StyleSheet} from 'react-native'


export default function ForgotPasswordScreen(){
  return(
    <View style={styles.container}>
      <Text style={
        styles.text
      }>
        Bem vindo a tela de recuperação de senha (em contrução)

      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: "center"
  },
  text:{
    textAlign: 'center',
     fontSize:32,
  }
})