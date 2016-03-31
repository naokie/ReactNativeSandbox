const React = require('react-native');

const {
  AppRegistry,
  StyleSheet,
  Text,
  ListView,
  View,
  ScrollView,
  TouchableHighlight,
  AsyncStorage,
} = React;

const Button = require('react-native-button');
const GiftedSpinner = require('react-native-gifted-spinner');

const api = require('../src/api.js');

const moment = require('moment');

const TOTAL_NEWS_ITEMS = 10;

class NewsItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Design Reader',
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      news: {},
      loaded: false,
    };
  }

  render() {
    return (
      <View style={ styles.container }>
        <View style={ styles.header }>
          <View style={ styles.header_item }>
            <Text style={ styles.header_text }>{ this.state.title }</Text>
          </View>
          <View style={ styles.header_item }>
            {
              !this.state.loaded &&
              <GiftedSpinner />
            }
          </View>
        </View>
        <View style={ styles.body }>
          <ScrollView ref="scrollView">
            {
              this.state.loaded &&
              <ListView
                initialListSize={ 1 }
                dataSource={ this.state.news }
                style={ styles.news }
                renderRow={ this.renderNews }
               />
            }
          </ScrollView>
        </View>
      </View>
    );
  }

  componentDidMount() {
    AsyncStorage.getItem('news_items').then((news_items_str) => {
      var news_items = JSON.parse(news_items_str);

      if (news_items != null) {
        AsyncStorage.getItem('time').then((time_str) => {
          var time = JSON.parse(time_str);
          var last_cache = time.last_cache;
          var current_datetime = moment();

          var diff_days = current_datetime.diff(last_cache, 'days');

          if (diff_days > 0) {
            this.getNews();
          } else {
            this.updateNewsItemsUI(news_items);
          }
        });
      } else {
        this.getNews();
      }
    }).done();
  }

  renderNews(news) {
    return (
      <TouchableHighlight onPress={ this.viewPage.bind(this, news.url) } underlayColor={ '#E8E8E8' } style={ styles.button }>
        <View style={ styles.news_item }>
          <Text style={ styles.news_item_text }>{ news.title }</Text>
        </View>
      </TouchableHighlight>
    );
  }

  viewPage(url) {
    console.log(url);

    this.props.navigator.push({
      name: 'web_page',
      url: url,
    });
  }

  updateNewsItemsUI(news_items) {
    if (news_items.length == TOTAL_NEWS_ITEMS) {
      var ds = this.state.dataSource.cloneWithRows(news_items);

      this.setState({
        news: ds,
        loaded: true,
      });
    }
  }

  updateNewsItemsDB(news_items) {
    if (news_items.length == TOTAL_NEWS_ITEMS) {
      AsyncStorage.setItem('news_items', JSON.stringify(news_items));
    }
  }

  getNews() {
    const TOP_STORIES_URL = 'https://hacker-news.firebaseio.com/v0/topstories.json';
    var news_items = [];

    AsyncStorage.setItem('time', JSON.stringify({
      'last_cache': moment(),
    }));

    api(TOP_STORIES_URL).then((top_stories) => {
      console.log(top_stories);

      for (let i = 0; i <= 10; i++) {
        var story_url = 'https://hacker-news.firebaseio.com/v0/item/' + top_stories[i] + '.json';

        api(story_url).then((story) => {
          news_items.push(story);
          this.updateNewsItemsUI(news_items);
          this.updateNewsItemsDB(news_items);
        });
      }
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDDDFF',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FF6600',
  },
  body: {
    flex: 9,
    backgroundColor: '#F6F6EF',
  },
  header_item: {
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
  },
  header_text: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  button: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  news_item: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 5,
  },
  news_item_text: {
    color: '#575757',
    fontSize: 18,
  },
});

module.exports = NewsItems;
