
if (typeof window !== 'undefined') {
  require('../../sass/confirm.scss');
}

const Confirm = function () {
  const that = this;

  const template_confirm = '\
		<div class="confirm-block confirm-block-2">\
			<div class="content">\
				<div class="text">$content</div>\
				<div class="btns flex-box ">\
					<button class="no cancelBtn flex" />取消</button>\
					<button class="yes confirmBtn flex" />确定</button>\
				</div>\
			</div>\
		</div>';
  const template_alert = template_confirm.replace('<button class="no cancelBtn flex" />取消</button>', '');
  const template__alert = '<div class="content">$content</div>';
  const template__confirm = '\
		<div class="confirm-block">\
			<div class="content confirmBtn">$content</div>\
		</div>';

  const UI_confirm = document.createElement('div');
  UI_confirm.className = 'UI_confirm';

  const wrap =  document.createElement('div');
  wrap.className = 'confirm-wrap';

  this._alert = function (msg,boolen) {
    const UI_confirm_s = document.createElement('div');
    UI_confirm_s.innerHTML = template__alert.replace('$content', msg);
    UI_confirm_s.className = 'UI_confirm_auto'+(boolen?' active':'');
    document.body.appendChild(UI_confirm_s);
    setTimeout(() => {
      UI_confirm_s.classList.add('dispear');
      setTimeout(() => {
        document.body.removeChild(UI_confirm_s);
      }, 300);
    }, 2000);
  };
  this.wrap =  function(dom){
    var body = dom || document.body;
    body.appendChild(wrap)
  };
  this.removeWrap = function(dom){
    var body = dom || document.body;
    body.removeChild(wrap);
  };
  this.alert = function (msg, callback) {
    that.remove();
    UI_confirm.innerHTML = template_alert.replace('$content', msg);
    that.onConfirmBtn(UI_confirm, callback);
    document.body.appendChild(UI_confirm);
  };
  this.levelUp = function(obj){
    const level_block = '\
    <div class="level-block">\
      <div class="header"></div>\
      <div class="content">\
        <div class="img-blocks">\
            <img src='+obj.image_url+' />\
        </div>\
        <div class="details">\
          <p><span>恭喜升级为</span><span class="col-red">'+obj.grade_name+'</span></p>\
          <p>'+obj.content+'</p>\
        </div>\
      </div>\
    </div>';

    var wrapper =  document.createElement('div');
    wrapper.className = 'confirm-wrap black';
    wrapper.innerHTML = level_block;
    document.body.appendChild(wrapper);

    wrapper.onclick = function(){
      wrapper.classList.add('dispear');
      setTimeout(function(){
          document.body.removeChild(wrapper);
      },300)
    };
  };
  this.confirm = function (msg, callback, cancel) {
    that.remove();
    UI_confirm.innerHTML = template_confirm.replace('$content', msg);
    const cancelBtn = UI_confirm.querySelector('.cancelBtn');
    that.onConfirmBtn(UI_confirm, callback);
    that.onCancelBtn(cancelBtn, cancel);
    document.body.appendChild(UI_confirm);
  };
  this._confirm = function (msg, callback, cancel, top) {
    that.remove();
    UI_confirm.innerHTML = template__confirm.replace('$content', msg);
    that.onConfirmBtn(UI_confirm, callback);
    that.onCancelBtn(UI_confirm, cancel);
    if (top) {
      UI_confirm.children[0].style.top = `${top}px`;
    }
    document.body.appendChild(UI_confirm);
  };
  this.onConfirmBtn = function (UI_confirms, callback) {
    const confirmBtn = UI_confirms.querySelector('.confirmBtn');
    confirmBtn.onclick = function (e) {
      if (typeof callback === 'function') { callback(); }
      e.stopPropagation && (e.stopPropagation)();
			// setTimeout(that.remove,300);
      that.remove();
    };
  };
  this.onCancelBtn = function (cancelBtn, callback) {
    cancelBtn.onclick = function (e) {
      if (typeof callback === 'function') { callback(); }
			// callback();
      e.stopPropagation && (e.stopPropagation)();
			// setTimeout(that.remove,300);
      that.remove();
			// alert('b')
    };
  };
  this.remove = function () {
    const blocks = document.body.querySelectorAll('.UI_confirm');
    for (let i = 0; i < blocks.length; i++) {
      document.body.removeChild(blocks[i]);
    }
  };
};

module.exports = new Confirm();
