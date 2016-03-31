const React = require('react-native');

const {
  StyleSheet,
  View,
} = React;

class WebPage extends React.Component {
  render() {
    return (
      <View style={ styles.container }></View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFDDDD',
  },
});

module.exports = WebPage;
