cs-lib v. 1.2.2
======

DFP helper methods for Creatives Services @SNI

DoubleClick for Publishers by Google (DFP), formerly called Google Dart,[1] is an advertisement software as a service application run by Google. It can be used as an ad server but it also provides a variety of useful features for managing the sales process of online ads using a publisher's dedicated sales team. Should a publisher not sell out all their available ad inventory, it can choose to run either other ad networks or AdSense ads as remnant inventory in DoubleClick for Publishers (source: http://en.wikipedia.org/wiki/DoubleClick_for_Publishers)


CS Lib makes delivering creatives a easier by implementing the `Write less, do more` syndrom that jQuery incorporates using a small set of helper methods. note: Some of these methods are specific to Scripps Networks Interactive (SNI)

Methods:

	adManager( prop, [ (optional) val ] )
	escape( wrap, html, [ (optional) complete ] )
	explode( html, [ (optional) complete ] )
	frame()
	include( urls, [ (optional) force ], [ (optional) complete ] )
	log()
	native( options )
	restrict( prop, id, [ (optional) complete ] )
	report( options )
	rsi( options )
	template( str, data, [ (optional) context ] )
	track( urls, [ (optional) complete ] )
