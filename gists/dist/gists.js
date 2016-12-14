var horizon = Horizon();
horizon.connect();

const gists = horizon('gists');

const Main = { template:
  '<div class="ui form">'
    + '<div class="field">'
      + '<label>Gist title</label>'
      + '<input type="text">'
    + '</div>'
    + '<div class="field">'
      + '<label>Short Text</label>'
      + '<textarea rows="30"></textarea>'
    + '</div>'

    + '<div class="ui submit button">Submit</div>'

  +' </div>'
};

const Gist = {
  template: '<div>A gist! {{ foo }}</div>',
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.foo = 'foo';
      gists.find(this.$route.params.id).fetch().subscribe(
        (msg) => {
          this.foo = 'a';
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


gists.watch({rawChanges: true}).subscribe(gists => {

  if (gists.new_val == undefined) {
    return;
  }
  gists.new_val.link = '/gist/' + gists.new_val.id;
  mainApp.gists.push(gists.new_val)
});

