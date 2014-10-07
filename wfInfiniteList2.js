/* need angular.js and iscroll-infinite-wf.js 
    note!
      cell element should be half of the cacheSize.
      e.g. 15 child elements and cacheSize=30 .

    <wf-infinite-list2 > must have following attrs:
      inf-element      = string:'.someCell'
      delegate         = object:delegateObject !note1
      history-limit    = int: 0
      history-position = int: 0
      load-more-offset = int: 80 , a gap from bottom to trigger load-more.
      page-size        = int: 30 , number of recs in each load.
    optional attrs:
      pulling-html     = 'pull to load more'
      release-html     = 'release for loading'
      loading-html     = 'loading...'
      nothing-html     = 'no more for loading' 



    !note1:
      delegate must have these two methods:
        onFillCellHtmlContentWF(element,index)
        onNeedLoadMoreDataWF(scrollerRef,index)


    !note2:
      After onNeedLoadMore finished, following method must be called 
        to make scroller know more data can be displayed.
          scrollerRef.loadingMoreFinishedWF:
            function(isOk , start , count , dataArray , newlimit, isAll )

*/
angular.module('Wangf',['ngAnimate'])
  .directive('wfInfiniteList2',function($http,$timeout){
    return {
      restrict:'E' ,
      template:"<div id='wilWrapper2'"+
              " style='position:absolute;margin:0px;"+
              "padding:0px;width:100%;top:0px;left:0px;"+
              "bottom:0px;background-color:white;overflow:hidden;'"+
              " ng-transclude>"+
              "</div>" +
              " <div id='loadMoreCell2' "+
              " style='position:absolute;top:9990px;left:0px;width:100%;height:44px;"+
              " text-align:center;color:#696969;padding-top:20px'"+
              ">上拉加载更多</div>" ,
      transclude:true ,
      scope:{infElement:'@',delegate:'=',
              loadMoreOffset:'@',pageSize:'@',
              historyLimit:'@',
              historyPosition:'@',
              pullingHtml:'@',
              releaseHtml:'@',
              loadingHtml:'@',
              nothingHtml:'@'
            },
      link: function(scope , elem , attrs ){

          scope.pageSize = parseInt(scope.pageSize) ;

          //init iscroll5.
          scope.scroller = new IScroll("#wilWrapper2",{
            tap:true ,
            infiniteLimit: scope.historyLimit,
            historyPosition: scope.historyPosition,
            infiniteElements:scope.infElement,
            onFillCellHtmlContentWF:scope.delegate.onFillCellHtmlContentWF,
            onNeedLoadMoreDataWF:   scope.delegate.onNeedLoadMoreDataWF,
            loadMoreOffsetWF: scope.loadMoreOffset,
            cacheSize: scope.pageSize , 
            pullForMoreHtmlWF:scope.pullingHtml,
            releaseForMoreHtmlWF:scope.releaseHtml,
            loadingForMoreHtmlWF:scope.loadingHtml,
            nothingForMoreHtmlWF:scope.nothingHtml
          });

          if( scope.historyLimit > 0 )
          {
            //scroll to last position.
            scope.scroller.scrollTo(0,parseInt(scope.historyPosition),0) ;
            scope.scroller.reorderInfinite() ;
          }else
          {
            //first load.
            $timeout(function(){
              scope.scroller.loadingMoreBeginWF() ;
            },200) ;
          }
      } 
    } ;
}) ;