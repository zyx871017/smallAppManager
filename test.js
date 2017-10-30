var s = 'aabbaabbaabbaa';
var m = 3;

var res = [];
var last = s[0];
var rnum = 1;
for(var i = 1; i < s.length; i ++){
  if(s[i] != last){
    res.push(rnum);
    last = s[i];
    rnum = 1;
  }else{
    rnum ++;
  }
}
res.push(rnum);
var result = 0;
var maxa = res[0];
var ma = res[1];
var ia = 0;
var maxb = res[1];
var mb = res[2];
var ib = 1;
for(var i = 2; i < res.length; i ++){
  if(i % 2 == 0){
    if(mb + res[i] <= m){
      mb += res[i];
    }else{
      if(maxb + m - mb > result) {
        result = maxb + m - mb;
      }
      mb = mb + res[i];
      while(mb <= m){
        maxb - res[ib];
        mb - res[ib + 1];
        ib += 2;
      }
    }
    maxa = maxa += res[i];
  }else{
    if(ma + res[i] <= m){
      ma += res[i];
    }else{
      if(maxa + m - ma > result) {
        result = maxa + m - ma;
      }
      ma = ma + res[i];
      while(ma <= m){
        maxa - res[ia];
        ma - res[ia + 1];
        ia += 2;
      }
    }
    maxb = maxb += res[i];
  }
}
console.log(result);