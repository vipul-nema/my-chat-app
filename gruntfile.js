module.exports = function(grunt) {
require('load-grunt-tasks')(grunt);
 grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public/css/',
          src: ['*.css'],
          dest: 'public/min/css/',
          ext: '.min.css'
        }]
      }
    },
    babel: {
        options: {
            plugins: ['transform-react-jsx'], // npm install babel-plugin-transform-react-jsx
            presets: [ 'react'] // npm install babel-preset-es2015 babel-preset-react
        },
        jsx: {
            files: [{
                expand: true,
                cwd: 'public/js/components/',
                src: ['*.jsx'],
                dest: 'public/js/compiledComponents/',
                ext: '.js'
            }]
        }
    },
    uglify: {
        my_target: {
        files: [{
            expand: true,
            cwd: 'public/min/js',
            src: '*.js',
            dest: 'public/min/js/',
            ext: '.min.js'
        }]
        }
    },
    concat: {
        options: {
            separator: ';',
        },
        dist: {
            src: ['public/js/service/chatService.js', 'public/js/compiledComponents/chatComponent.js'],
            dest: 'public/min/js/bundle.js',
        }
    },
   watch: {
        scripts: {
            files: ['public/**/*.*'],
            tasks: ['default'],
            options: {
            spawn: false,
            },
        },
        },
 
    
  });


    // grunt.loadNpmTasks('grunt-babel');
    // grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-contrib-watch');


 grunt.registerTask('default', ['babel','concat', 'cssmin','uglify']);

};