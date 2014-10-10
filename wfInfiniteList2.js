/* need angular.js and iscroll-infinite-wf.js 
    note!
      cell element should be half of the cacheSize.
      e.g. 15 child elements and cacheSize=30 .

    <wf-infinite-list2 > 
    must have following attrs:
      inf-element      = string:'.someCell'
      delegate         = object:delegateObject !note1
      history-limit    = int: 0
      history-position = int: 0
      page-size        = int: 30 , number of recs in each load.
      wrapper-parent-id        = wrapperXXXX , wrapperId for <wf-infinite-list2> elementId.
                          this string value should be unique in DOM 
                          and must be the same as this elementId.
                          e.g.  <wf-infinite-list2 id='w101' ... wrapper-id='w101'>  
    
    optional attrs:
      push-trigger-offset = 60
      push-start-html     = 'push to update'
      push-release-html   = 'release for update'
      push-loading-html   = 'updating'

      pull-trigger-offset = 60
      pull-start-html     = 'pull to load more'
      pull-release-html     = 'release for loading'
      pull-loading-html     = 'loading...'
      pull-nothing-html     = 'no more for loading' 



    !note1:
      delegate must have :
        delegate.onData(el,index)
        delegate.onPullTriggered(sref,start0)
        delegate.onPushTriggered(sref)
        delegate.getDataCount()
        delegate.onScrollerReady(sref) 



    !note2:
      After onPullTriggered/onPushTriggered
      finished, following method must be called 
      to make scroller know more data can be displayed.
        scrollerRef.pushPullLoadingFinished:function(isOk, isAll )


    ScrollerRef useful function:
      ScrollerRef.setPullElementDisplay(boolValue) ;
      boolValue = ScrollerRef.isPullElementDisplay() ;

*/
angular.module('Wangf',['ngAnimate'])
  .directive('wfInfiniteList2',function($http,$timeout){
    return {
      restrict:'E' ,
      template:"<div"+
              " style='position:absolute;margin:0px;"+
              "padding:0px;width:100%;top:0px;left:0px;"+
              "bottom:0px;background-color:white;overflow:hidden;'"+
              " ng-transclude>"+
              "</div>" +
              " <div "+
              " style='position:absolute;top:9990px;left:0px;width:100%;height:44px;"+
              " text-align:center;color:#696969;padding-top:20px'"+
              ">上拉加载更多</div>" +
              " <div "+
              " style='position:absolute;top:9990px;left:0px;width:100%;height:44px;"+
              " text-align:center;color:#696969;padding-top:20px'"+
              ">下拉更新</div>",
      transclude:true ,
      scope:{
              infElement:'@',
              delegate:'=',
              historyLimit:'@',
              historyPosition:'@',
              pageSize:'@',
              wrapperParentId:'@',

              pushTriggerOffset:'@',
              pushStartHtml:'@',
              pushReleaseHtml:'@',
              pushLoadingHtml:'@',
              pullTriggerOffset:'@',
              pullStartHtml:'@',
              pullReleaseHtml:'@',
              pullLoadingHtml:'@',
              pullNothingHtml:'@'
            },


      link: function(scope , elem , attrs ){

          scope.pageSize = parseInt(scope.pageSize) ;
         //init iscroll5. "#"+scope.wrapperId
          scope.scroller = new IScroll({
            tap:true ,
            wrapperParentId:scope.wrapperParentId,
            delegate:scope.delegate , 
            infiniteLimit:scope.historyLimit,
            historyPosition: scope.historyPosition,
            infiniteElements:scope.infElement,
            cacheSize: scope.pageSize , 
            pushTriggerOffset:scope.pushTriggerOffset,
            pushStartHtml:scope.pushStartHtml,
            pushReleaseHtml:scope.pushReleaseHtml,
            pushLoadingHtml:scope.pushLoadingHtml,
            pullTriggerOffset:scope.pullTriggerOffset,
            pullStartHtml:scope.pullStartHtml,
            pullReleaseHtml:scope.pullReleaseHtml,
            pullLoadingHtml:scope.pullLoadingHtml,
            pullNothingHtml:scope.pullNothingHtml
          });


          scope.delegate.onScrollerReady(scope.scroller) ; 
      } 
    } ;
}) ;