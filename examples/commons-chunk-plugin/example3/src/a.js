require('./1')
require('./2')
require('./3')

require.ensure([],function(){
  require('./5')
  require('./7')
},'B')

require.ensure([],function(){
  require('./5')
  require('./6')
},'C')