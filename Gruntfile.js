module.exports = function(grunt) {

// load plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-usemin');

// build task
  grunt.registerTask('build', [
    'useminPrepare',
    'concat:generated',
    'uglify:generated',
    'copy',
    'usemin'
  ]);

  var targets = ['*.html'];

  grunt.config('useminPrepare', {
    html: targets,
    options: {
      dest: 'gh-pages'
    }
  });

  grunt.config('copy', {
    html: {
      src: targets,
      dest: 'gh-pages/'
    },
    css: {
      src: 'crrlib.css',
      dest: 'gh-pages/stylesheets/'
    }
  });

  grunt.config('usemin', {
    html: targets.map(function(v) { return 'gh-pages/' + v; }),
  });

};
