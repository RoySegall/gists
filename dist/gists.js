var horizon = Horizon();
horizon.connect();

const gists = horizon('gists');

const Main = {
  template:
    '<div>'
      + '<form class="ui form">'

        + '<div v-if="errors">'
          + '<div class="ui negative message">'
            + '<div class="header">Wow!</div>'
            + '<p>You forgot to fill in the title or the code</p>'
          + '</div>'
        + '</div>'

        + '<div v-if="success">'
          + '<div class="ui positive message">'
            + '<div class="header">You got it dud!</div>'
            + '<p>You created a new gist. You are not excited? <router-link :to="new_gist_link">Go and watch it!</></p>'
          + '</div>'
        + '</div>'

        + '<div class="field">'
          + '<label>Gist title</label>'
          + '<input type="text" v-model="new_gist.file_name" required="required">'
        + '</div>'
        + '<div class="field">'
          + '<label>code</label>'
          + '<textarea rows="30" v-model="new_gist.code" required></textarea>'
        + '</div>'

        + '<div class="ui submit button" v-on:click="submitGists()">Submit</div>'

      + '</form>'
    + '</div>',

  data: function() {
    return {
      new_gist: {
        file_name: '',
        code: ''
      },
      new_gist_link: '',
      errors: false,
      success: false
    }
  },
  methods: {
    submitGists() {
      if (this.new_gist.code == "" || this.new_gist.file_name == "") {
        this.errors = true;
      }
      else {
        this.errors = false;

        var gist = gists.store({
          title: this.new_gist.file_name,
          code: this.new_gist.code,
          time: Math.floor(Date.now() / 1000)
        }).subscribe(gists => {
          this.success = true;
          this.new_gist_link = '/gist/' + gists.id;
          this.new_gist = {};
        });

      }
    }
  }
};

const Gist = {
  template:
  '<div>' +
    '<router-link to="/">Go back</router-link>' +
    '<h1>{{ gistInfo.title }}</h1>' +
    '<div><textarea class="element" rows="30">{{ gistInfo.code }}</textarea></div>' +
  '</div>',
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData();
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  data: function() {
    return {
      gistInfo: ''
    }
  },
  methods: {
    fetchData () {
      gists.find(this.$route.params.id).fetch().subscribe(
        (data) => {
          this.gistInfo = data;
        }
      );
    }
  }
};

const routes = [
  { path: '/', component: Main },
  { path: '/gist/:id', component: Gist}
];

const router = new VueRouter({
  routes
});

const mainApp = new Vue({
  router,
  data: {
    gists: []
  }
}).$mount('#mainApp');


gists.order('time').watch({rawChanges: true}).subscribe(gists => {

  if (gists.new_val == undefined) {
    return;
  }
  gists.new_val.link = '/gist/' + gists.new_val.id;
  mainApp.gists.unshift(gists.new_val)
});
