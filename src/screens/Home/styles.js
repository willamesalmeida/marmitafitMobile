import { StyleSheet, Dimensions } from "react-native"


const { width, height} = Dimensions.get('window')


export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    width: width,
    height: height,
    justifyContent: "center"
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent:"center",
    borderColor: "#ef4444",
    padding:20,
  },
  title: {
    color:"#ef4444",
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'

  },
  subtitle:{
    color:"#efaada",
    fontSize:32,
    marginBottom: 20,
    textAlign: 'center'
  },
})