import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea:{
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent:"flex-start",
    padding: 16,
  },
  ownerImage:{
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor:"red",
    marginBottom:25
  },
  card: {
    display:'flex',
    backgroundColor: 'white',
    borderRadius: 13,
    elevation: 3,
    shadowColor: 'skyblue',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 16,
    width: '100%',
    marginVertical: 10,
  },
  formItem: {
    marginBottom: 16,
    align:"left"
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label1: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
   
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding:4 ,
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },

signUp: {
    color: "green",
    fontWeight: "bold",
    fontSize: 14,
    borderBottomColor: "green",
    // borderBottomWidth: 1,
},




});