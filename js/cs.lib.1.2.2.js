;(function( window, __me, undefined ) {

/*
	NOTE :: anything inside here will log as the parent window when logging
	e.g. console.log( window );
*/


/*
	BEGIN cs lib
	
	
	methods
		
		adManager( prop, [ (optional) val ] )
		dfp()
		escape( wrap, html, [ (optional) complete ] )
		explode( html, [ (optional) complete ] )
		frame()
		include( urls, [ (optional) force ], [ (optional) complete ] )
		log()
		restrict( prop, id, [ (optional) complete ] )
		report( options )
		rsi( options )
		template( str, data, [ (optional) context ] )
		track( urls, [ (optional) complete ] )


*/

/* we'll leave cs lib as function and keep options for chaining */
( cs = function( options ) {
	return new cs.fn.init( options );
}).fn = prototype = {
	
	init : function( options ) {
		
		/* for templates */
		cs.cache		= {};
		
		var $this			= this;
		
		$this.$				= typeof window.jQuery != 'undefined' ? window.jQuery : null;
		$this.jQuery		= typeof window.jQuery != 'undefined' ? window.jQuery : null;
		$this.mdManager		= typeof window.mdManager != 'undefined' ? window.mdManager : null;
		$this.body			= window.document.body;
		
		$this.version		= '1.2.0';
		
		if ( typeof options != 'undefined' ) {
			$this.options = options;
		}
		
		return $this;
	},
	
	/*
		getFromAdManager :: Get a property from the ad manger on the parent page.
	*/
	adManager : function( prop, val ) {
		var $this = this;
		
		if ( $this.mdManager ) {
			if ( typeof val != 'undefined' ) {
				$this.mdManager.setParameter( prop, val );
			} else {
				return $this.mdManager.getParameter( prop );
			}
		}
		return $this;
	},
	
	collapse : function( frame ) {
		var frame = typeof frame !== 'undefined' && typeof frame !== 'string' && frame !== ''
						? frame
						: __me.name;
		this.frame.fn.collapse.call( this, frame );
		return this;
	},
	
	/* $.cookie */
	cookie : function( name, value, options ) {
		if ( typeof value !== 'undefined' ) {
			options = options || {};
			if ( value === null ) {
				value = '';
				options.expires = -1;
			}
			var expires = '';
			if ( options.expires && ( typeof options.expires == 'number' || options.expires.toUTCString ) ) {
				var date;
				if ( typeof options.expires == 'number' ) {
					date = new Date();
					date.setTime( date.getTime() + ( options.expires * 24 * 60 * 60 * 1000 ) );
				} else {
					date = options.expires;
				}
				expires = '; expires=' + date.toUTCString();
			}
			var path = options.path
						? '; path=' + ( options.path )
						: '';
			var domain = options.domain
						? '; domain=' + ( options.domain )
						: '';
			var secure = options.secure
						? '; secure'
						: '';
			
			document.cookie = [ name, '=', encodeURIComponent( value ), expires, path, domain, secure ].join( '' );
		} else {
			var cookieValue = null;
			
			if ( document.cookie && document.cookie != '' ) {
				var cookies = document.cookie.split( ';' );
				for ( var i=0; i<cookies.length; i++ ) {
					var cookie = jQuery.trim( cookies[ i ] );
					if ( cookie.substring( 0, name.length + 1 ) == ( name + '=' ) ) {
						cookieValue = decodeURIComponent( cookie.substring( name.length + 1 ) );
						break;
					}
				}
			}
			return cookieValue;
		}
	},
	
	dfp : function() {
		return new this.dfp.fn.init();
	},
	
	/*
		escape :: Escape out of the child iframe onto the parent page.
	*/
	escape : function( wrap, html, complete ) {
		this.frame.fn.escape.call( this, wrap, html, complete );
		window.cs.escaped.push({
			wrap		: wrap,
			html		: html,
			complete	: complete
		});
		return this;
	},
	
	explode : function( html, complete ) {
		this.frame.fn.explode.call( this.frame, this, html, complete );
		window.cs.exploded.push({
			html		: html,
			complete	: complete
		});
		return this;
	},
	
	/*
		iFrame methods
			- escape
			- get
			- resize
	*/
	frame : function() {
		return new this.frame.fn.init();
	},
	
	include : function( urls /* As String or Array */, force, complete ) {
		var $this = this;
		
		function include( url, force, complete ) {
			//var $this	= this;
			
			if ( typeof url !== 'undefined' && typeof url === 'string' ) {
				var s		= url.lastIndexOf( '/' ) + 1,
					e		= url.indexOf( '.', s ),
					id		= url.substring( s, e ),
					obj		= {
						id		: id,
						type	: 'js',
						url		: url
					},
					included	= false,
					complete	= typeof complete === 'undefined' ? force : complete,
					force		= typeof force !== 'undefined' && typeof force !== 'function' ? force : false;
				
				function cachedScript( url, options ) {
					options = $this.$.extend(options || {}, {
						dataType	: 'script',
						cache		: true,
						url			: url
					});
					return $this.$.ajax( options );
				};
				
				function getScript( url, complete ) {
					cachedScript( url )
					//$this.$.getScript( url )
						.done(function( script, status ) {
							if ( cs().isFN( complete ) ) {
								complete.call( $this );
							}
						});
				};
				
				if ( url.indexOf( '.js' ) != -1 ) {
					$this.$.each( window.cs.included, function( i, o ) {
						/* even though we ID'd it, we want to match the url */
						if ( o.type === 'js' && o.url === url ) {
							included = true;
							return false;
						}
					});
					if ( !included || force ) {
						getScript( url, complete );
					}
				} else if ( url.indexOf( '.css' ) != -1 ) {
					
					$this.$.each( window.cs.included, function( i, o ) {
						/* even though we ID'd it, we want to match the url */
						if ( o.type === 'css' && o.url === url ) {
							included = true;
							return false;
						}
					});
					
					if ( !included || force ) {						
						$this.$( this.body ).append( '<link rel="stylesheet" href="' + url + '"/>' );
						obj.type = 'css';
					}
					
					if ( cs().isFN( complete ) ) {
						complete.call( $this );
					}
				}
				
				if ( !included ) {
					window.cs.included.push( obj );
				}
			}
		};
		
		if ( typeof urls != 'undefined' && ( typeof urls === 'string' || $this.$.isArray( urls ) ) ) {
			if ( typeof urls === 'string' ) {
				include.apply( $this, [ urls, force, complete ] );
			} else if ( $this.$.isArray( urls ) ) {
				$this.$.each( urls, function( i, url ) {
					include.apply( $this, [ url, force, complete ] );
				});
			}
		}
		return $this;
	},
	
	isFN : function( o ) {
		return typeof o !== 'undefined' && typeof o === 'function' ? true : false;
	},
	
	isMobile : function() {
		var check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	},
	
	/* simple method to log arguments */
	log : function() {
		if ( typeof console != 'undefined' && typeof console.log != 'undefined' ) {
			console.log( Array.prototype.slice.call( arguments ) );
		}
		return this;
	},
	
	popout : function( html, before, complete ) {
		this.frame.fn.popout.call( this.frame, this, html, before, complete );
		return this;
	},
	
	/*
		restrict :: Restrict mock to variable
		(usually retreived from the page such as mdManager.getParameter [ uniqueId ] )
		
		usage:
			cs().restrict( prop, id )
	*/
	restrict : function( prop, id, complete ) {
		
		var $this	= this,
			pass	= false;
		
		if ( typeof prop != 'undefined' && typeof id != 'undefined' ) {
			var tid = $this.adManager( prop ) || '';
			
			if ( tid === id ) {
				pass = true;
			}
		}
		
		if ( pass && cs().isFN( complete ) ) {
			complete.call( $this, prop, id );
		}
		
		return $this;
	},
	
	report : function( options ) {
		this.include( 'http://adimages.scrippsnetworks.com/creative-services/rsi/dfp-reports.js', true, function() {
			/* TODO :: something */
		});
		return this;
	},
	
	template : function tmpl( str, data, context ) {
		var context		= typeof context !== 'undefined' ? context : window,
			fn			= !/\W/.test( str ) ?
							cs.cache[ str ] = cs.cache[ str ] ||
								tmpl( document.getElementById( str ).innerHTML ) :
									new Function( 'obj', 'context',
										'var window = context, p = [], print = function() { p.push.apply( p, arguments ); };' +
										"with ( obj ) { p.push( '" +
											str
												.replace( /[\r\t\n]/g, '' )
												.split( '<%' ).join( '\t' )
												.replace( /((^|%>)[^\t]*)'/g, '$1\r' )
												.replace( /\t=(.*?)%>/g, "',$1,'" )
												.split( '\t' ).join( "');" )
												.split( '%>' ).join( "p.push('" )
												.split( '\r' ).join( "\\'" )
										+ "');}return p.join('');" );
			return data ? fn( data, context ) : fn;
	},
	
	track : function( urls, complete ) {
		var $this		= this,
			urls		= typeof urls !== 'undefined' && ( typeof urls === 'string' || $this.$.isArray( urls ) ) ? urls : '';
			
		function track( url, complete ) {
			
			var $this	= this,
				url		= url
							.replace( /\$random\$|\[timestamp\]/gi, +new Date() ),
				img		= '<img src="' + url + '" height="0" width="0" border="0"/>';
			
			$this.escape( $this.$( $this.body ), img, function( wrap, html ) {
				if ( cs().isFN( complete ) ) {
					complete.call( $this, wrap, html );
				}
			});
			
			var obj = {
				callback	: complete,
				img			: $this.$( img ),
				strImg		: img,
				url			: url
			};
			
			window.cs.trackRecord.push( obj );
		};
		
		if ( typeof urls === 'string' && urls !== '' ) {
			track.apply( $this, [ urls, complete ] );
		} else if ( $this.$.isArray( urls ) && urls.length > 0 ) {
			$this.$.each( urls, function( i, url ) {
				track.apply( $this, [ url, complete ] );
			});
		}
		
		return $this;
	}
	
};

cs.fn.frame.fn = {
	init : function() {
		var $this			= this;
		
		$this.$				= typeof window.jQuery != 'undefined' ? window.jQuery : null;
		$this.jQuery		= typeof window.jQuery != 'undefined' ? window.jQuery : null;
		$this.mdManager		= typeof window.mdManager != 'undefined' ? window.mdManager : null;
		$this.body			= window.document.body;
		
		if ( typeof options != 'undefined' ) {
			$this.options = options;
		}
		
		return $this;
	},
	
	collapse : function( frame ) {
		var frame = typeof frame !== 'undefined' && typeof frame !== 'string' && frame !== ''
						? frame
						: __me.name;
		window.parent.SniAds.Iframe.resizeSlot( frame, 0, 0 );
	},
	
	escape : function( wrap, html, complete ) {
		var $this = this;
		
		if ( typeof wrap !== 'undefined' && wrap && typeof html !== 'undefined' ) {
			$this.$( html )
				.appendTo( $this.$( wrap ), $this.$( $this.body ) )
				.css( 'display', 'block' );
			
			if ( cs().isFN( complete ) ) {
				complete.call( $this, wrap, html );
			}
		}
		return $this;
	},
	
	explode : function( context, html, complete ) {
		
		/* the context will be cs [Object] */
		var $this	= context;
		var f		= this.fn.get(),
			parent	= $this.$( f )[ 0 ] !== null && $this.$( f )[ 0 ].nodeType === 1 ? $this.$( f ).parent() : null;
		
		$this.$( parent ).prepend( html );
		/*
			note: removing the iframe results in a loss of context (possibly) in JS
			e.g. reports did not run without setting the context of the window object within the template method
			
			also any other content within the child iframe will be destroyed
		*/
		/* MODIFIED - 10-02-2014 to hide the iframe rather than detroy it */
		$this.$( f ).hide();
		
		if ( cs().isFN( complete ) ) {
			complete.call( $this, html, f );
		}
		return $this;
	},
	
	get : function( selector ) {
		
		var w			= document,
			w			= document.defaultView || document.parentWindow,
			frames		= w.parent.document.getElementsByTagName( 'iframe' ),
			selector	= typeof selector != 'undefined' ? selector : null;
		
		if ( selector ) {
		} else {
			for ( var i = frames.length; i --> 0; ) {
				var frame= frames[ i ];
				try {
					var d = frame.contentDocument || frame.contentWindow.document;
					if ( d === document ) {
						return frame;
					}
				} catch( e ) {}
			}
		}
		return this;
	},
	
	popout : function( context, html, before, complete ) {
		
		/* the context will be cs [Object] */
		var $this	= context;
		var before	= typeof before !== 'undefined' && typeof before === 'boolean'
						? before : false,
			f		= this.fn.get(),
			parent	= $this.$( f )[ 0 ] !== null && $this.$( f )[ 0 ].nodeType === 1 ? $this.$( f ).parent() : null;
		
		$this.$( parent )[ ( before ? 'prepend' : 'append' ) ]( html );
		
		if ( cs().isFN( complete ) ) {
			complete.call( $this, html );
		}
		return $this;
	},
	
	resize : function( width, height, delay, easing, complete ) {
		var f = this.get();
		
		window.$( f ).animate({
			height	: height,
			width	: width
		},
			typeof delay != 'undefined' ? ( delay * 1000 ) : 0,
			typeof easing != 'undefined' ? easing : 'swing',
			typeof complete != 'undefined' ? complete : null );
		return this;
	}
	
};

/* DFP lib */
cs.fn.dfp.fn = {
	init : function() {
		var $this			= this;
		
		$this.$				= typeof window.jQuery != 'undefined' ? window.jQuery : null;
		$this.jQuery		= typeof window.jQuery != 'undefined' ? window.jQuery : null;
		$this.mdManager		= typeof window.mdManager != 'undefined' ? window.mdManager : null;
		$this.body			= window.document.body;
		
		if ( typeof options != 'undefined' ) {
			$this.options = options;
		}
		
		return $this;
	},
	
	native : function( options ) {
		var $this		= this,
			oData		= options.data,
			options		= this.$.extend({
					complete	: null,
					/*
						css property uses the include method so it can be an array
						this is the default CSS file for FN native modules
					*/
					css			: 'http://adimages.scrippsnetworks.com/iax/_modules/fn/native-module/fn-native-core.css',
					/* JavaScript data object for our template */
					data		: {},
					include		: null,
					restrict	: null,
					site		: 'fn',
					/* the Id of the HTML template to use (<script type="text/template">) */
					tmplDsk		: 'templ__fn_native_dsk',
					tmplMbl		: 'templ__fn_native_mbl',
					track		: null,
					type		: 'native-type-001',
					wrap		: $this.$( '#sponsorCtr1:eq(0)' )
				}, options ),
			template	= !cs().isMobile()
							/* DSK ID */
							? document.getElementById( options.tmplDsk )
								? document.getElementById( options.tmplDsk ).innerHTML
								: null
							/* MBL ID */
							: document.getElementById( options.tmplMbl )
								? document.getElementById( options.tmplMbl ).innerHTML
								: null,
			html		= typeof template !== 'undefined' && template
							? cs().template( template, options.data )
							: '';
		
		function escape( $this, html, options ) {
			cs().escape( options.wrap, html, function() {
				
				if ( options.track && ( typeof options.track === 'string' || $this.$.isArray( options.track ) ) ) {
					cs().track( options.track );
				}
				
				if ( options.include ) {
					cs().include( options.include );
				}
				
				if ( options.complete ) {
					options.complete.call( $this, html, options );
				}
			});
		};
		
		if ( html !== '' ) {
			/* include native CSS */
			cs().include( options.css, function() {
				
				if ( options.restrict && typeof options.restrict === 'string' ) {
					cs().restrict( 'uniqueId', options.restrict, function() {
						escape( $this, html, options );
					});
				} else {
					escape( $this, html, options );
				}
			});
		}
	},
	
	pgi : function( options ) {
		var $this		= this,
			oData		= options.data,
			options = this.$.extend({
					complete	: null,
					/* the Id of the HTML template to use (<script type="text/template">) */
					tmpl		: 'cs_tmpl_pgi',
					/* JavaScript data object for our template */
					data		: null
				}, options );
		
		if ( options.data && typeof options.data === 'object' ) {
			var id		= typeof options.data.id != 'undefined' ? options.data.id : null,
				slides	= typeof options.data.slides != 'undefined' ? options.data.slides : null;
			
			if ( id && slides && document.getElementById( options.tmpl ) ) {
				
				/* set our cookie */
				var cookieObj	= cs().cookie( id ) || {};
				
				cookieObj	= typeof cookieObj !== 'object' ? $this.$.parseJSON( cookieObj ) : cookieObj,				
				slideNum	= cookieObj && typeof cookieObj.slideNum !== 'undefined' ? parseInt( cookieObj.slideNum, 10 ) : -1,
				slideNum	= slideNum + 1;
				
				if ( slideNum > slides.length - 1 ) {
					slideNum = 0;
				}				
				
				cookieObj = $this.$.extend( cookieObj, {
					slideNum	: slideNum
				});
				
				cs().cookie( id, JSON.stringify( cookieObj ), { expires : 365 });				
				
				var template	= document.getElementById( options.tmpl ).innerHTML,
					html		= typeof template !== 'undefined' && template ? cs().template( template, slides[ slideNum ] ) : '';
				
				if ( html !== '' ) {
					
					/* special conversion for allowing templates to piggy-back into this one */
					html = html
							.replace( /<T/g, '<%' )
							.replace( /T>/g, '%>' );
					
					cs().explode( html, function( html /* As string inside parent body content */, frame ) {
						
						if ( options.complete ) {
							options.complete.call( $this, frame, html, options, slides[ slideNum ] );
						}
					});
				}
			}
		}
		
		return $this;
	},
	
	rsi : function( options ) {
		
		var $this		= this;
		var oData		= options.data,
			oRecipes	= typeof oData.recipes !== 'undefined' ? oData.recipes : [];
		
		var options = this.$.extend({
					complete	: null,
					keyword		: cs().adManager( 'keyterm' ) || '',
					/* the DOM element we want to inject our HTML into */
					wrap		: null,
					/* the Id of the HTML template to use (<script type="text/template">) */
					tmpl		: null,
					/* JavaScript data object for our template */
					data		: null
				}, options ),
			data		= options.data,
			keyword		= options.keyword,
			tmpl		= options.tmpl,
			wrap		= options.wrap;
		
		
		function save( data, html, tmpl, template, wrap, recipes ) {
			if ( typeof data.recipes !== 'undefined' ) {
				data.recipes = recipes;
			}
			var obj = {
				data : data,
				/*recipes : recipes,*/
				tmpl : {
					id			: tmpl,
					html		: html,
					template	: template
				},
				wrap	: wrap
			};
			
			window.cs.rsiCache.push( obj );
		};
		
		function matchRecipes( kw, recipes /* As Array */ ) {
			var ary = [],
				non	= [],
				$	= $this.$;
			
			$.each( recipes, function() {
				var f = false,
					r = this;
				
				if ( typeof r.keywords != 'undefined' ) {
					/* per speaking to Ad Ops, we just want to see if the keyword is in the array */
					if ( $.inArray( kw, r.keywords ) > -1 ) {
						ary.push( r );
					} else {
						non.push( r );
					}
				}
			});
			cs.non = shuffle( non );
			return ary;
		};
		
		function shuffle( array ) {
			var ci = array.length, temp, ri;
			
			while ( 0 !== ci ) {
				ri = Math.floor( Math.random() * ci );
				ci -= 1;
				temp = array[ ci ];
				array[ ci ] = array[ ri ];
				array[ ri ] = temp;
			}
			return array;
		};
		
		if ( data && typeof data.recipes != 'undefined' ) {
			
			/* Get a matched set of recipes, shuffle them and reassign to options.data */
			data.recipes = shuffle( matchRecipes( keyword, data.recipes ) );
			
			/* some defaults */
			data = this.$.extend({
				numRecipes			: 1/*,
				internalTracking	: RSI.impression,
				impression1x1		: RSI.impression1x1*/
				/* trueCount can go here / defaults */
			}, data );
			
			if ( data.recipes.length < data.numRecipes ) {
				var len = data.numRecipes - data.recipes.length;
				
				for ( var i=0; i<len; i++ ) {
					data.recipes.push( cs.non[ i ] );
				}
			}
			
//			$this.$.get( 'http://adimages.scrippsnetworks.com/creative-services/rsi/dfp-rsi-templates.htm', function( page ) {
//				var $page		= $this.$( page ),
//					template	= $page.filter( '#' + tmpl ).html();
				var template = document.getElementById( tmpl ).innerHTML;
				
				if ( tmpl ) {
					var html = typeof template !== 'undefined' ? cs().template( template, data ) : '';
					
					if ( html !== '' ) {
						
						/* save RSI data to the cs [Object] in the parent window */
						
						/*
							currently `wrap` is depricated as RSI is exploding out
							of the iframe onto it's wrapper
							
							TODO :: implement `wrap` back into RSI as alternate option
									of appending RSI to DOM rathger than exploding
						
						*/
						save( data, html, tmpl, template, wrap, oRecipes );
						
						cs()
							.explode( html, function( html /* As string inside parent body content */ ) {
								if ( options.complete ) {
									options.complete.call( $this, html );
								}
							});
					}
				}
//			});
		}
		return $this;
	}
	
};


cs.fn.init.prototype = cs.fn;
cs.fn.frame.fn.init.prototype = cs.fn.frame.fn;
cs.fn.dfp.fn.init.prototype = cs.fn.dfp.fn;

/* setup some alternate method routes */
cs.fn.native = cs.fn.dfp.fn.native;
cs.fn.pgi = cs.fn.dfp.fn.pgi;
cs.fn.rsi = cs.fn.dfp.fn.rsi;

/* some default storage */
cs.included		= [];
cs.rsiCache		= [];
cs.trackRecord	= [];

cs.escaped		= [];
cs.exploded		= [];

window.$dfp = window.cs = cs;


//cs.fn.frame.fn.init.prototype = cs.fn.frame.fn;

/* END cs */


})( parent.window, window );

