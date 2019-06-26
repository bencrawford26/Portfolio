var express = require('express');  
var request = require('request');
var cors = require('cors')
var app = express()
 
app.use(cors())

/*
app.use('/Timeline/GetEvents', function(req, res) {  
  res.send({msg:'lolk'});
});
*/

app.use('/team15', function(req, res) {  
  console.log(req.url)
  var url = 'https://ideagengcu.s3.eu-west-1.amazonaws.com/Team15' + req.url;
  console.log(url);
  req.pipe(request(url)).pipe(res);
});

//https://ideagengcu.s3.eu-west-1.amazonaws.com/Team15/889f273a-973d-4fce-8a87-9d22f0fb0190?X-Amz-Expires=900&x-amz-security-token=FQoDYXdzEBYaDJRD8%2FxA6Pzwcu0NgiKZAu0B%2BVqKoDfnTm8wJ7oGA21drtEYJZ7weg9I3MIjjnc1FHc7g2EkYmTovXXBSFhiDeIbMJgnuOJ1zdjE%2BHQ0ndSkjfiAHyKjodch0JBxA6mHhgXAs5SYfyrlOI%2BfTvl%2BnjImXpK4pf5xRhjMLCdlMuxpqsWXjMTdgOsStFT7QDOtblPNd2CvK21ozY1YFiGljSUesCm9kET0bKd4unSHEMTs7PirrW2kPSGa0MexlY2pWZpu4lrtgem8b7va17SKjYxFAqo7nF35ToTXQV6fJURVZWP3hRlZ4tutLYLahRpYB%2B21eA9rWbX%2FE%2B0VhwCrt6WEswCkU4RmHXfNPRn9ofJx3EsQYu2MQiJpEQ3WXA5HhYxxl7jKb5WDKJyc5dQF&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAJJYZZ5XIX4T3BKMA/20180302/eu-west-1/s3/aws4_request&X-Amz-Date=20180302T144437Z&X-Amz-SignedHeaders=host;x-amz-security-token&X-Amz-Signature=7c51e8d443be62c116eb749de88f42b38e6e07ca3324c357c696909018faf42d

app.use('/', function(req, res) {  
  var url = 'https://gcu.ideagen-development.com' + req.url;
  console.log(url);
  req.pipe(request(url)).pipe(res);
});

app.listen(process.env.PORT || 3000);  

console.log('Server running on port 3000');