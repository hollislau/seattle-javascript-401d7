module.exports = function(app) {
  app.controller('AuthController', ['cfAuth', 'cfHandleError',  '$location', function(auth, handleError, $location) {
    this.username = '';
    this.errors = [];
    this.getUsername = function() {
      // AUTH_EXP: What happens when this function is called?
      // This calls the getUsername function from the auth service, which returns a promise that
      // is either resolved with username info or rejected with an http or auth error. If properly
      // resolved, then the username is stored on a property on this controller. Otherwise,
      // the error handling function is called, which displays a "could not get username" message
      // to the user.
      auth.getUsername()
        .then((currentUser) => {
          this.username = currentUser;
        }, handleError(this.errors, 'could not get username'));
    }.bind(this);

    this.logout = function() {
      auth.removeToken();
      this.username = '';
      $location.path('/signin');
    }.bind(this);
  }]);
};
