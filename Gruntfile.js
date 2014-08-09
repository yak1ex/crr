module.exports = function(grunt) {

// concat
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.config('concat', {
    scripts: {
      src: [
        'bower_components/jquery/dist/jquery.js',
        'bower_components/mathjs/dist/math.js',
        'crrlib.js'
      ],
      dest: 'tmp/crr.js'
    }
  });

// uglify
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.config('uglify', {
    scripts: {
      files: {
        'gh-pages/javascripts/crr.js': 'tmp/crr.js'
      }
    }
  });

};
