Parse.initialize("G4X5y6WDZ51U9g0Iv1LcyaOeT2DsFDgNFS350BkN", "5P3GTnoyFwx8sPu9YT5sP7vl3aAtH1xN8l6T6MVB");

var Todo = Backbone.Model.extend({
  defaults: {
    task: '',
    priority: '',
    status: ''
  }
});

// var parse = require('parse');

var CompletedTodo = Backbone.Model.extend({
  defaults: {
    completedTask: '',
    completedPriority: '',
    status: ''
  }
});

var Todos = Backbone.Collection.extend({
  // url: 'https://G4X5y6WDZ51U9g0Iv1LcyaOeT2DsFDgNFS350BkN:javascript-key=5P3GTnoyFwx8sPu9YT5sP7vl3aAtH1xN8l6T6MVB@api.parse.com/1/classes/TodoObject/G4X5y6WDZ51U9g0Iv1LcyaOeT2DsFDgNFS350BkN'
});

var todos = new Todos();

var CompletedTodos = Backbone.Collection.extend({});

var completedTodos = new CompletedTodos();

//Backbone view for one todo
var TodoView = Backbone.View.extend({
  model: new Todo(),
  tagName: 'tr',
  initialize: function() {
    this.template = _.template($('.todos-list-template').html());
  },
  events: {
    'click .finished-todo': 'done',
    'click .delete-todo' : 'delete'
  },
  done: function() {
    var completed = new CompletedTodo({
      completedTask: this.$('.task').html(),
      completedPriority: this.$('.priority').html(),
      status: 'finished'
    });

    var CompletedObject = Parse.Object.extend("CompletedObject");
    var completedObject = new CompletedObject();
    completedObject.save({completedTask: this.$('.task').html(), completedPriority: this.$('.priority').html(), status: 'finished'})
    completedTodos.add(completed);

    var parseId = this.model.attributes.parse_id;
    var TodoObject = Parse.Object.extend('TodoObject');
    var query = new Parse.Query(TodoObject);
    query.get(parseId, {
      success: function(object) {
        object.destroy();
      },
      error: function(object, error){
        console.log('There is an error in deletion in done event')
      }
    }) 
    this.model.destroy();
    this.$el.html('');
  },
  delete: function() {
    var parseId = this.model.attributes.parse_id;
    var TodoObject = Parse.Object.extend('TodoObject');
    var query = new Parse.Query(TodoObject);
    query.get(parseId, {
      success: function(object) {
        object.destroy();
      },
      error: function(object, error){
        console.log("There is an error in deletion in delete event")
      }
    });
    this.model.destroy();
    this.$el.html('');
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

//Backbone view for all todos
var TodosView = Backbone.View.extend({
  model: todos,
  el: $('.todos-list'), 
  initialize: function() {
    var self = this;
    this.model.on('add', this.render, this);
    this.model.on('remove', this.render, this);
    (new Parse.Query('TodoObject'))
      .equalTo('status','unfinished')
      .find()
      .then(function(response) {
        response.forEach( function(object) {
          var todo = new Todo({
            task: object.get('task'),
            priority: object.get('priority'),
            status: 'unfinished',
            parse_id: object.id

          });
          self.$el.append((new TodoView({model: todo})).render().$el);
        })
      })
  },
  render: function() {
    var self = this;
    // this.$el.html('');
    console.log(this.model.toJSON());
    _.each(this.model.toArray(), function(todo) {
      self.$el.append((new TodoView({model: todo})).render().$el);
    });
    return this;
  }
});

//View for one Completed Todo
var CompletedTodoView = Backbone.View.extend({
  model: new CompletedTodo(),
  tagName: 'tr',
  initialize: function() {
    this.template = _.template($('.completed-todos-template').html());
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

//View for all Completed Todos
var CompletedTodosView = Backbone.View.extend({
  model: completedTodos,
  el: $('.completed-todos-list'), 
  initialize: function() {
    var self = this;
    this.model.on('add', this.render, this);
    (new Parse.Query('CompletedObject'))
      .equalTo('status','finished')
      .find()       
      .then(function(response) {
        response.forEach( function(object) {
          var completedTodo = new CompletedTodo({
            completedTask: object.get('completedTask'),
            completedPriority: object.get('completedPriority'),
            status: 'finished',
            parse_id: object.id
          });
          self.$el.append((new CompletedTodoView({model: completedTodo})).render().$el);
        })
      })
  },
  render: function() {
    var self = this;
    // this.$el.html('');
    _.each(this.model.toArray(), function(completedTodo) {
      self.$el.append((new CompletedTodoView({model: completedTodo})).render().$el);
    });
    return this;
  }
});

var todosView = new TodosView();
var completedTodosView = new CompletedTodosView();


$(document).ready(function() {
  $('.add-todo').on('click', function() {
    var todo = new Todo({
      task: $('.task-input').val(),
      priority: $('.priority-input').val(),
      status: 'unfinished'
    });
    var taskInput = $('.task-input').val()
    var priorityInput = $('.priority-input').val()
    var TodoObject = Parse.Object.extend("TodoObject");
    var todoObject = new TodoObject();
    todoObject.save({task: taskInput, priority: priorityInput, status: 'unfinished'})
    $('.task-input').val('');
    $('.priority-input').val('');
    todos.add(todo);
  });
});





