/***
	 author: huangjiaolong
	 date: 2017.05.20
	 (1) DOM：
   已知 dialog 内容
	  <div class="modal-dialog-1" style="display:none;">
			cool-modal-dialog1111
			<p>ccccc</p>
		</div>
	 dialog 内容异步获取
	 <div class="modal-dialog-ajax" style="display: none;"></div>
	 (2) JS
	 var modal1 = $('.modal-dialog-1', root).modal({
	 	modalId: 'news-modal-dialog1'
	 });
	 opt暂时只有modalId一个属性
	 对外暴露的属性及方法：
	 A. modal实例属性：
	 $modalMask
	 $modalCont
	 $modalDialog

	 B. modal 方法:
	 show(opt, callback)
	 close()
	 closeDialog()
***/
;(function($, win, doc, undefined){
	var _getSingle = function( fn ){
	  var result;
		return function(){
			return result || ( result = fn.apply(this, arguments ) );
		} 
	};

	var _createModalMask = function(){
		return $('<div class="cool-modal"></div>')
						.appendTo('body');
	}

	var _createModalDialog = function($cont, id){
		return $('<div class="cool-modal-dialog"></div>')
						.addClass(id)
						.append($cont);
	}
	
	$.fn.modal = function(options, callback){
		return new Modal(this, options, callback);
	}

	var Modal = function(ele, options){
		var me = this;
		me.$modalMask = $();
		me.$modalCont = $(ele);
		me.$modalDialog = $();
		me.id = -1;
		me.$isOpened = null;
		me.opt = $.extend(true, {maskClickAble: false}, options);
		me.opt.modalClass = me.opt.modalId + '-mask';

		me.init(options);
		return me;
	}
	
	// 初始化openTime
	Modal.openTime = 0;
	Modal.prototype.init = function(){
		var me = this;
		
		me.id = "cool-modal." + me.opt.modalId;
		me.$modalDialog = _createModalDialog(me.$modalCont, me.opt.modalId);
	}

	Modal.prototype.show = function(options,  callback){
		var me = this;
		var opt = $.extend(true, {}, options);
		
		me.$modalMask = _getSingle(_createModalMask)();
		me.$modalMask.addClass(me.opt.modalClass);

		if(me.opt.maskClickAble === true){
			me.$modalMask
				.off('click.coolmodal')
				.on('click.coolmodal', function(e){
					e.stopPropagation();
					me.close({'from': 'body'});
				})
		}

		$('html').addClass('has-cool-modal');
		me.$modalDialog.appendTo('body').css({'display': 'block'});
		me.$modalCont.css({'display': 'block'});
		me.$isOpened = true;
		
		$("body").off("touchmove")
							.on("touchmove", function(e){
								e.preventDefault();
							}, false);
		
		Modal.openTime = new Date().getTime();
		callback && callback(me.$modalDialog)
	}

	Modal.prototype.closeDialog = function(options, callback){
		var me = this;
		var opt = $.extend(true, {}, options);

		me.$modalDialog.css({'display': 'none'});
	}

	Modal.prototype.close = function(options, callback){
		var me = this;
		var opt = $.extend(true, {}, options);

		$('.cool-modal').remove();
		$('.cool-modal-dialog.' + me.opt.modalId).css({'display': 'none'});
		
		if( !$('.cool-modal').length ){
			$('html').removeClass('has-cool-modal');
			$("body").off("touchmove");
		}
		
		me.$isOpened = false;
		
		// mask-staytime
		var now = new Date().getTime();
		callback && callback(me)
	}
	
})($, window,document,undefined);
