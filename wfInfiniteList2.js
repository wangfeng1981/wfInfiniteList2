/* need angular.js and iscroll-infinite-wf.js 
    note!
      cell element should be half of the cacheSize.
      e.g. 15 child elements and cacheSize=30 .

    <wf-infinite-list2 > 
    must have following attrs:
      id               = unique string id.
      inf-element      = string:'.someCell' Note3!
      delegate         = object:delegateObject !note1
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
        delegate.onData=function(el,index)
        {
          el.innerHTML = 'cell'+index ;
        };
        delegate.onPullTriggered=function(sref,start0)
        {
          //staff...

          // onok: sref.pushPullLoadingFinished(isOk, isAll );
        };
        delegate.onPushTriggered=function(sref)
        {
          //staff...

          // onok: sref.pushPullLoadingFinished(isOk, isAll );
        };
        delegate.getDataCount=function()
        {
          return 0 ;
        } ;
        delegate.onScrollerReady=function(sref)
        {
          //the first push or scroll to history position.
          sref.pushLoadBegin() ;
          sref.setPullElementDisplay(false) ;
          //history: sref.scrollTo(x,y) ;
        } ; 



    !note2:
      After onPullTriggered/onPushTriggered
      finished, following method must be called 
      to make scroller know more data can be displayed.
        sref.pushPullLoadingFinished:function(isOk, isAll )


    sref useful functions:
      sref.setPullElementDisplay(boolValue) ;
      boolValue = sref.isPullElementDisplay() ;
      sref.pushLoadBegin() ;
      sref.pullLoadBegin() ;
      sref.scrollTo(x,y) 
      sref.refresh() ;
      sref.reorderInfinite() ;

    InfiniteElement useful properties:
      element._phase : index in datasource.
      element._top   : top position in scroller.


    !note3
    inf-element css style must like:
    .xxxCell {
      position:absolute;
      top:0px;
      left:0px;
      ...
    }

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