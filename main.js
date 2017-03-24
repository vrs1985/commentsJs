;
'use srict';

(() => {
  var App = this;
  this.model = new AppModel();
  this.view = new AppView(this.model);
  this.controller = new AppCtrl(this.model, this.view);
})();

function AppModel() {
  let AppModel = this;
  this.currStorage=[];
  this.oldStorage=[];
  this.newStorage = {};
  this.digitRow = 0;
  this.commentCount=0;
  this.keyArray = ["name", "date", "msg"];

  this.init = ()=>{
    this.getItem();
  };

  this.currComments = [
    {"name": "Nick", "date": 1490196710233, "msg": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit." },
    {"name": "John Doe", "date":  1485056810233, "msg": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo." },
    {"name": "mr. Smith", "date": 1489106910233, "msg": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit." }
  ];

    this.getItem = ()=>{
      let valueStorage = localStorage.getItem("comment");
      this.currStorage = JSON.parse(valueStorage);
      return this.currStorage;
    };
    this.setItem = (args)=>{
      let value = JSON.stringify(this.packageStorage(args));
      localStorage.setItem("comment", value);
    };
    this.removeItem = (args)=>{
      localStorage.removeItem("comment");
      location.reload(true);
    };

    this.packageStorage = (val)=>{
      let currStorage = this.getItem();
      let value = val;
      for(var any in currStorage)
        if (currStorage.hasOwnProperty(any))
          this.digitRow = Object.keys(currStorage).length;
      if(currStorage)
        this.newStorage = currStorage;
      this.newStorage[this.digitRow] = value;
      return this.newStorage;
    };

    this.concateComments = ()=>{
      let value = this.getItem();
      if(this.currStorage){
        for(var any in value){
          let newObj = {};
          for(let i=0; i<3;i++){
            newObj[this.keyArray[i]] = value[any][i];
          }
          this.currComments.push(newObj);
        }
      }
      this.commentCount = this.currComments.length;
      this.currComments.sort(compareDate);
      return this.currComments;
    };

    function compareDate(dateA, dateB) {
      return dateA.date - dateB.date;
    }

  this.getValue = (e)=>{
    let name = document.getElementById('comment.name');
    let msg = document.getElementById('comment.message');
    let date = Date.now();
    let error = this.checkKeyWord(name.value);
    if(error === 'error')
      return error;
    let value = [name.value, date, msg.value];
    this.setItem(value);
    name.value='', msg.value='';
    return value;
  };

  this.checkKeyWord = (str)=>{
    let reg = /(admin)/gi;
    if ( str.length < 2 || str === undefined || str === null || reg.test(str))
      return 'error';
    };

this.init();
}

function AppView(model) {
  let AppView = this;
  this.model = model;
  this.ul = document.getElementById('comment');
  this.form = document.getElementById('addComment');
  this.commCount = document.getElementById('commCount');
  this.error = `Please change name`;
  this.allComment = this.model.concateComments();
  this.init = () =>{
    this.start();
  };

  this.drawComment = (args) => {
    let li = document.createElement('li');
    li.classList.add('comment-item');
    let classArray = ['comment-name', 'comment-create', 'comment-message'];
    let commentArray = args;
    for(let i=0; i<3;i++){
      let span = document.createElement('span');
      span.classList.add(classArray[i]);
      span.innerHTML = (i == 1)? new Date(commentArray[i]).toLocaleDateString() : commentArray[i];
      li.append(span);
    }
    this.ul.append(li);
  };

  this.drawErr = (msg)=>{
    let firstElem = this.form.firstChild.className;
    if( firstElem === 'error')
      return;
    let err = document.createElement('div');
    err.classList.add('error');
    err.innerHTML = this.error;
    this.form.prepend(err);
  };

  this.changeCount = (number)=>{
    this.commCount.innerHTML = number;
  };

  this.start = ()=>{
    for( let i=0; i<this.allComment.length; i++){
      let name = this.allComment[i].name;
      let msg = this.allComment[i].msg;
      let date = this.allComment[i].date;
      let value = [name, date, msg];
      AppView.drawComment(value);
    };
    this.changeCount(this.allComment.length);
  };

  this.init();

}

function AppCtrl(model, view) {
  let AppCtrl = this;
  this.model = model;
  this.view = view;
  this.commented = document.getElementById('commented');
  this.clear = document.getElementById('clear');

  this.commented.addEventListener('click', e => this.addComment(), false);
  this.clear.addEventListener('click', e => this.removeComment(), false);

  this.addComment = ()=>{
    let message = this.model.getValue();
    if(message === 'error')
      return this.view.drawErr(message);
    this.view.changeCount(++this.model.commentCount);
    this.view.drawComment(message);
  };

  this.removeComment = ()=>{
    this.model.removeItem('comment');
  };

};