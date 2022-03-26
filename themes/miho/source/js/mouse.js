var a_idx = 0;
jQuery(document).ready(function($) {
	$("body").click(function(e) {
		var a = [
			"弱者是没有资格谈正义的",
			"这是男人的承诺",
			"存在，并不是罪恶",
			"如果放弃，我将终身遗憾",
			"我有个野心",
			"我不是天生的王者，但我骨子里流动着不让我低头的血液",
			"只管把目标定在高峰，人家要笑就让他去笑",
			"因为要去见那个不一般的人，所以我就不能是一般人",
			"身不动，能否退去黑暗，花与水",
			"这个世界那么脏，谁有资格说悲伤",
			"没有任何回忆是可以遗忘的",
			"真相永远只有一个",
			"人活著就是在看别人死亡",
			"我的船上没有手下……只有伙伴",
			"赢了，赢了又怎么样",
			"正因为我们看不见，那才可怕",
			"不相信自己的人，连努力的价值都没有"
		];
		var $i = $("<span></span>").text("🌟" + a[a_idx] + "🌟");
		a_idx = (a_idx + 1) % a.length;
		var x = e.pageX,
			y = e.pageY;
		$i.css({
			"z-index": 999999999999999999999999999999999999999999999999999999999999999999999,
			"top": y - 20,
			"left": x,
			"position": "absolute",
			"font-weight": "bold",
			"font-size": "16px",
			"color": "rgb("+~~(255*Math.random())+","+~~(255*Math.random())+","+~~(255*Math.random())+")"
		});
		$("body").append($i);
		$i.animate({
				"top": y - 180,
				"opacity": 0
			},
			1500,
			function() {
				$i.remove();
			});
	});
});
