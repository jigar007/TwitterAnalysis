var reduce = function(key,value){ redVal = { "mapped_vals" : [] } ; for (var idx=0; idx<value.length; idx++){ redVal.mapped_vals.push(value); }; return redVal; }

# initially insert tag processed as no 
db.tweets.update({}, {$set : {"processed":"no"}}, {upsert:false, multi:true});

# get unprocessed tweets
var result = db.tweets.find({"processed":"no"}, {"_id": 0, "doc.text":1 , "doc.source":1 , "doc.user.location":1, "doc.user.profile":1 , "doc.place":1 , "doc.entities.hashtags":1});

# to add processed tag to the documents
db.tweets.update({}, {$set : {"processed":"yes"}}, {upsert:false, multi:true});



var map = function() { emit(this.doc.text , this.doc.id) }
var reduce = function(key,value) { var cont = {con : []};  cont.con.push(value); return cont; }
db.tweets.mapReduce(map,reduce,{out:"mrOut"})


#get hashtags
db.tweets.find({$where : "this.doc.entities.hashtags.length > 1"} , {"doc.entities.hashtags.text":1})

# get hashtags via map reduce
var map = function() { emit(this.id , this.entities.hashtags) }
var reduce = function(key , value) { var sm = {sd : [] };  sm.sd.push(value);  return sm; }
db.tweets.mapReduce(map,reduce,{out:"mrOut"})


var reduce = function(key , value) { var sm = {sd : [] };  sm.sd.push(value);  if (value.length > 0) { return sm; } }

var map = function(){
	var hashtags = this.entities.hashtags;
	if (hashtags.length > 1) {
		emit(this.id , this.entities.hashtags.text)
	}
}

# map reduce to get only text and coordinates

var map = function(){
 	if (this.coordinates !== null) { 
 		emit(this.id , {"text": this.text ,"coordinates":this.coordinates}) 
 	} 
}

var reduce = function(key, value){
	var out = { sm : [] } ;
	return out.sm.push(out);
}

db.tweets.mapReduce(map,reduce,{out:"onlyText"})


# map reduce to get hashtags

var reduce2 = function(key,hash) {
	
	var out = { sm : [] };

	for (var i=0 ; i < hash.length ; i++ )
	{
		out.sm.push(hash[i].text);
	}

	return out;
}

var map = function() {
	if(this.entities.hashtags.length > 0) {
		emit(this.text , this.entities.hashtags)
	}
}

var reduce = function(key,value) {
	var out = { sm : [] } ;
	out.sm.push(out);
	return {out.hash}
}

db.tweets.mapReduce(map,reduce2,{out:"onlyHash2"})



# just hashtags

var map = function() {
	emit("text", this.retweet_count)
}

var reduce = function(key , text) {
	var out = {m : []
    for (values in text) {
    out.m.push(values)
    }
}


db.tweets.mapReduce(map,reduce,{out:"onlyHash2"})


# aggregate

db.tweets.aggregate([
{
	"$group" :
	{
	"_id"
	}
}
])


# map reduce to get only text and coordinates

var map = function() {
	if (this.coordinates !== null) { 
		emit(this.id, {text : this.text , co : this.coordinates})
	}
}

var reduce = function(key , text) {
	var out = {m : []}
    for (values in text) {
    out.m.push(values)
    }
}


db.health.mapReduce(map,reduce,{out:"health_pros"})

# raw tweets

var map = function() {
	if (this.coordinates !== null) { 
		emit(this.id, {text : this.text , co : this.coordinates})
	}
}

var reduce = function(key , text) {
	var out = {m : []}
    for (values in text) {
    out.m.push(values)
    }
}


db.rawTweet.mapReduce(map,reduce,{out:"rawTweet_pros"})

# news

var map = function() {
	if (this.coordinates !== null) { 
		emit(this.id, {text : this.text , co : this.coordinates})
	}
}

var reduce = function(key , text) {
	var out = {m : []}
    for (values in text) {
    out.m.push(values)
    }
}


db.news.mapReduce(map,reduce,{out:"news_pros"})


# shows

var map = function() {
	if (this.coordinates !== null) { 
		emit(this.id, {text : this.text , co : this.coordinates})
	}
}

var reduce = function(key , text) {
	var out = {m : []}
    for (values in text) {
    out.m.push(values)
    }
}


db.news.mapReduce(map,reduce,{out:"onlyco"})


## map reduce to search for hashtags and emit only those that has 

db.rawtweets2_pros.remove({"value.text":null});
db.health_pros.remove({"value.text":null});
db.news_pros.remove({"value.text":null});
db.rawTweet_pros.remove({"value.text":null});
db.shows_pros.remove({"value.text":null});

## find null values

db.rawtweets2_pros.find({"value.text": null} ,{"_id":1 , "value.text":1 , "co.coordinates":1}).count()
db.health_pros.find({"value.text": null} ,{"_id":1 , "value.text":1 , "co.coordinates":1}).count()
db.news_pros.find({"value.text": null} ,{"_id":1 , "value.text":1 , "co.coordinates":1}).count()
db.rawTweet_pros.find({"value.text": null} ,{"_id":1 , "value.text":1 , "co.coordinates":1}).count()
db.shows_pros.find({"value.text": null} ,{"_id":1 , "value.text":1 , "co.coordinates":1}).count()


# aggregrate 

db.rawTweet_pros.aggregate ({
	$group : {
	_id : "$tweet_sentiment",
	total : {$sum : 1}
	}
})


var map = function() { 
	emit("coo" , [this.value.co.coordinates[1] , this.value.co.coordinates[0]]) ;
}

var reduce = function(key , value) { 
	var aa = {}; 
	for (val in value) {
	 aa[val] = value[val]; 
 	}      
 return aa; 
 }

db.health_pros.mapReduce(map,reduce,{out:"onlyco"})



var map = function() { 
	emit("coo" , [this.value.co.coordinates[1] , this.value.co.coordinates[0]]) ;
}

var reduce = function(key , value) { 
	var aa = {sm : []}; 
	for (val in value) {
	 aa.sm.push(value[val])
 	}      
 return aa; 
 }

db.health_pros.mapReduce(map,reduce,{out:"onlyco"})

# check text

var map = function(){
	var search_cri = ["and" , "or"];
	if (this.text in "[and"]) {
	emit(this.id , this.text);
	} 
}

var reduce = function(key , value){
	var out = {sm:[]}
	for (val in value){
		out.sm.push(value);
	}
	return out;
}

db.news.mapReduce(map,reduce,{out:"jaja"})



db.rawtweets2_pros.find({"value.co.coordinates": null} ,{"_id":1 , "value.text":1 , "co.coordinates":1}).count()

db.suburban.aggregate (
{$group : {_id : "$Sub", total : {$sum : 1}}} ,
	{$sort: {stotal: -1}}
);


db.suburban.aggregate(
    { $group : {
        _id : 
        {"sub":"$sub" , "senti" :"$senti"},
        total_sub : { $sum : 1 }
        }
    },
    {$sort: {total_sub: -1}},
    {$out : "sub_senti"}
)

db.suburban.aggregate (
{$group : {_id : "$sub",total : {$sum : 1}}} ,
{$group : {_id : "$senti",tot : {$sum : 1}}}
);

var map = function(){
	emit(this.sub , this.senti)
}

var reduce = function(suburb, value){
	var count = 0
	var pos = 0
	var neg = 0
	var neu = 0

	for (val in value){
		count+=1
		if (value[val] == "positive") {
			pos+=1
		}
		if (value[val] == "negative") {
			neg+=1
		}
		if (value[val] == "neutral") {
			neu+=1
		}
	}
	
	return {suburb , senti : {pos , neg , neu} }
}


var map = function(){
	emit(this.sub , {"senti" : this.senti , "latlng": this.latlng })
}

var reduce = function(suburb, value){
	var count = 0
	var pos = 0
	var neg = 0
	var neu = 0

	for (val in value.senti){
		count+=1
		if (value.senti[val] == "positive") {
			pos+=1
		}
		if (value.senti[val] == "negative") {
			neg+=1
		}
		if (value.senti[val] == "neutral") {
			neu+=1
		}
	}
	
	return {suburb , senti : {pos , neg , neu} }
}

db.suburban.mapReduce(map,reduce,{out:"suburban_senti_count"})

db.suburban_senti_count.remove({"value.senti":null});


