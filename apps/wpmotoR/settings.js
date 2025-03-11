(function(back) {
  var FILE = "wpmotoR.settings.json";
  // Load settings
  var settings = Object.assign({
      routeStepSetting: 50,
      showCompass: 1,
  }, require('Storage').readJSON(FILE, true) || {});

  function writeSettings() {
    require('Storage').writeJSON(FILE, settings);
  }

  // Show the menu
  E.showMenu({
    "" : { "title" : "WP Moto R" },
    "< Back" : () => back(),
        'Show compass?': {
      value: !!settings.onoroff,  // !! converts undefined to false
      onchange: v => {
        settings.showCompass = v;
        writeSettings();
      }
    },
    'Waypoint complete distance (m)': {
      value: 50|settings.howmany,  // 0| converts undefined to 0
      min: 10, max: 1000,
      onchange: v => {
        settings.routeStepSetting = v;
        writeSettings();
      }
    },
  });
})