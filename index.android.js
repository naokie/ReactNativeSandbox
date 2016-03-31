const React = require('react-native');

const {
  AppRegistry,
  StyleSheet,
  Navigator,
} = React;

const NewsItems = require('./components/news-items');
const WebPage = require('./components/webpage');

const ROUTES = {
  news_items: NewsItems,
  web_page: WebPage,
};

class ReactNativeSandbox extends React.Component {
  renderScene(route, navigator) {
    const Component = ROUTES[route.name];

    return (
      <Component route={ route } navigator={ navigator } url={ route.url } />
    );
  }

  render() {
    return (
      <Navigator
        style={ styles.container }
        initialRoute={{ name: 'news_items', url: '' }}
        renderScene={ this.renderScene }
        configureScene={() => {
          return Navigator.SceneConfigs.FloatFromRight;
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

AppRegistry.registerComponent('ReactNativeSandbox', () => ReactNativeSandbox);
