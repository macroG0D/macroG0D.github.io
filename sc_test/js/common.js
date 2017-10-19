$(function() {
	var numbers = 0;
	var example = '';
	var equation = [];
	var percentageX = '';
	var percentageY = '';
	var symbol = '';

//Numbers inputs
$('.numBtn').click(function() {
	if (numbers.length >= 18) {
		return;
	} else {
		if (numbers == '0') {
			numbers = this.value;
		} 
		else if(numbers == '0.'){
			numbers += this.value;
		} else {
			numbers += this.value;
		}
	}
	$('.calcIn').text(numbers);
})

// 'A comma'
$('.commaBtn').click(function(){
	substring = ".";
	var x = numbers.indexOf(substring) !== -1;
	if(numbers.toString().length >= 1 && x === false){
		numbers += '.';
		$('.calcIn').text(numbers);
	} else if (numbers.toString() === '' || numbers.toString() === '0'){
		numbers += '0.';
		$('.calcIn').text(numbers);
	}
})

//C button
$('.cButton').click(function(){
	numbers = '0', example = ''
	$('.calcIn').text(numbers);
	$('.desk').text(example);
	equation = [];
})

//CE Button
$('.CEbtn').click(function(){
	numbers = '0';
	$('.calcIn').text(numbers);
})

//Del
$('.delBtn').click(function(){
	numbers = numbers.substring(0, numbers.length - 1);
	$('.calcIn').text(numbers);
})

//+ - / *
$('.funcBtn').click(function(){
		example += ($('.calcIn').text());
		$('.desk').text(example+=this.value);
		equation.push(numbers);
		equation.push(this.value);
		numbers = '';
		$('.calcIn').text(numbers);
		percentageX = (equation[0]);
		symbol = this.value;
})

//A square
$('.square').click(function(){
	$('.desk').text('sqr('+ numbers + ')');	
	console.log('sqr('+ numbers +')'+'=' + numbers*numbers)
	numbers = numbers*numbers;
	$('.calcIn').text(numbers);


})
//A radical
$('.radical').click(function(){
	$('.desk').text('√('+ numbers + ')');	
	console.log('√('+ numbers +')'+'=' + Math.sqrt(numbers))
	numbers = Math.sqrt(numbers);
	$('.calcIn').text(numbers);
	console.log('√('+ numbers +')'+'=' + numbers)
})

//%
$('.percentage').click(function(){
	var y = [];
	y.push(numbers);
	percentageY = (y[0]);
	var percentage = eval(percentageX * percentageY / 100);
	$('.desk').text(percentageX + symbol + percentage);
	$('.calcIn').text(percentage);
	equation = [percentageX, symbol];
	example = '';
	numbers = percentage;
	$('.±').click(function(){
		$('.desk').text(percentageX + symbol + '(' + numbers + ')');
	})
	console.log(percentageX + symbol + percentageY + '%' );
})

// ±
$('.±').click(function(){
	var temp1 = numbers*2;
	if (numbers > 0){
		numbers = numbers-temp1;
		$('.calcIn').text(numbers);
	}else if (numbers < 0){
		numbers = numbers-temp1;
		$('.calcIn').text(numbers);
	}else{
		return;
	}

})

// =
$('.equalBtn').click(function(){
	equation.push(numbers)
	$('.desk').text('');	
	$('.calcIn').text(numbers);
	y = equation.toString();
	y = y.replace (/,/g, "");
	var result = eval(y);
	$('.calcIn').text(result);
	console.log(y + '=' + result);
	equation = [];
	example = '';
	numbers = result;
	percentageX = '';
	percentageY = '';
	symbol = '';
})

//If more then 12 digits on number, changing font size to 1.5em, if 12 or less - keeps the standart font size of 2.5em.
$(window).click(function(){
	var smaller = document.querySelector('.calcIn');
	if (numbers.toString().length <= 12){
		smaller.style.fontSize = '2.5em';
	}else{
		smaller.style.fontSize = '1.5em';
	}
})

});

