import { StyleSheet, StatusBar } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    width: '100%',
  },
  contentContainerStyle: {
    paddingHorizontal: 24,
  },
  userIcon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    // borderRadius: "50%"
  },
  userLogoImg: {
    width: 40,
    height: 40,
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsView: {
    // padding: 20,
    flex: 2,
    width: '100%',
    paddingRight: 20,
  },
  label: {
    fontSize: 16,
    paddingTop: 13,
    paddingBottom: 5,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
  },
  listText: {
    fontSize: 20,
  },
  list: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: .5,
    borderBottomColor: 'gray',
    marginHorizontal: 20,

  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingVertical: 20,
  },
  button: {
    backgroundColor: 'green',
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
    color: 'pink',
    fontSize: 20,
    width: "45%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 5,
    color: 'pink',
    fontSize: 20,
    width: "45%",
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
