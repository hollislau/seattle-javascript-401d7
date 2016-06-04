var baseUrl = require('../../config').baseUrl;

module.exports = function(app) {
  app.factory('cfAuth', ['$http', '$q', function($http, $q) {
    // AUTH_EXP: explain what each of these functions are accomplishing and
    // what data we're storing in this service
    return {
      removeToken: function() {
        // Clears the token info stored in this service, from the header config in the $http
        // service, and from local storage. Also clears the username info stored in this service.
        // Essentially a logout function.
        this.token = null;
        this.username = null;
        $http.defaults.headers.common.token = null;
        window.localStorage.token = '';
      },
      saveToken: function(token) {
        // Stores the token that is passed into this function as a property on this service, saves
        // it in the header config in the $http service (each http request made will contain the
        // token in the request header), and in local storage. Also returns the token for further
        // use.
        this.token = token;
        $http.defaults.headers.common.token = token;
        window.localStorage.token = token;
        return token;
      },
      getToken: function() {
        // Checks to see if a token is saved on this service. If not, retrieves the token from
        // local storage and saves it to the service. Returns the token for use.
        this.token || this.saveToken(window.localStorage.token);
        return this.token;
      },
      getUsername: function() {
        // Returns a promise that checks to see if a username is set on this service. If so, the
        // promise is resolved with the username. If not, it checks to see if a token is stored
        // on this service or in local storage. If a token cannot be retrieved, the promise is
        // rejected with a "no token" error. Otherwise, it attempts to make a GET request to the
        // profile route on the API server to retrieve the username info and save it to this
        // service. If successful, the promise resolves with the username. If not, the promise
        // rejects with an auth or http error.
        return $q(function(resolve, reject) {
          if (this.username) return resolve(this.username);
          if (!this.getToken()) return reject(new Error('no authtoken'));

          $http.get(baseUrl + '/api/profile')
            .then((res) => {
              this.username = res.data.username;
              resolve(res.data.username);
            }, reject);
        }.bind(this));
      }
    }
  }]);
};
