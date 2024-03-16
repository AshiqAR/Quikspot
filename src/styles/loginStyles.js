import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    safeArea:{
        flex: 1,
        width: "100%",
        marginTop: 90,
      },
      scrollView:{
      },
        contentContainerStyle:{
            paddingVertical: 30,
        },
    
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent:"flex-start",
        padding: 16,
      },

container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
},
card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 5,
    shadowColor: "black",
    shadowRadius: 3,
    shadowOpacity: 1,
    paddingBottom: 20,
    elevation: 5,
},
details: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    width: "90%",
},
input: {
    height: 50,
    width: "85%",
    margin: 12,
    borderWidth: 1,
    borderColor: "lightgrey",
    padding: 8,
    borderRadius: 5,
    fontSize: 17,
    fontWeight: 'bold',
},
inputIsFocused: {
    borderColor: 'green',
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 1,
    // elevation: 2,
},
forgotPassword: {
    alignSelf: "flex-end",
    marginRight: 30,
    fontWeight: "medium",
    borderBottomWidth: 0.5,
    color: "green",
},
button: {
    backgroundColor: 'green',
    marginVertical: 10,
    padding: 10,
    borderRadius: 5 ,
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
    color: 'pink',
    fontSize: 20,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
},

signUpPart: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
    marginBottom: 20,
    alignContent: "center",
    marginTop: 10,
},

signUp: {
    color: "green",
    fontWeight: "bold",
    fontSize: 14,
    borderBottomColor: "green",
    // borderBottomWidth: 1,
},


});