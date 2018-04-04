(function(){

	Mura.init({
		siteid:'headless',
		rootpath:'http://headless.mura.local:8080',
		containerSelector:'body'
	});

	Mura(()=>{
		let templates={};

		Mura.loader()
			.loadcss(Mura.rootpath + '/core/modules/v1/core_assets/css/mura.7.1.min.css')
			.loadcss(Mura.rootpath + '/core/modules/v1/core_assets/css/mura.7.1.skin.css');

		function buildNav(container,parentid){

			container.html('');

			if(parentid=='00000000000000000000000000000000001'){
				container.html('<li><a href="./#">Home</a></li>');
			}

			Mura.getFeed('content')
			.where()
			.prop('parentid').isEQ(parentid)
			.getQuery()
			.then(collection=>{
				collection.forEach(item=>{
						container.append('<li><a href="' + item.get('url') + '">' + item.get('menutitle') + '</a></li>');
				});
			})
		}

		function renderNav(container,collection){
			container.html('');
			collection.forEach(item=>{
				container.append('<li><a href="' + item.get('url') + '">' + item.get('menutitle') + '</a></li>');
			});
		}

		function buildCrumbs(content){
			content.get('crumbs').then(collection=>{
			collection.get('items').reverse();
			renderNav( Mura('.mura-crumb-nav'),collection);
			})
		}

		function renderTemplate(template){
			return new Promise(
				(resolve, reject)=>{
					function applyTemplate(resp){
						Mura(Mura.containerSelector).html(resp);
						buildNav(Mura('.mura-primary-nav'),'00000000000000000000000000000000001');
						resolve();
					}

					if(typeof templates[template] == 'undefined'){
						Mura.get('./templates/' + template + '.html').then(resp=>{
							templates[template]=resp;
							applyTemplate(templates[template]);
						});
					} else {
						applyTemplate(templates[template]);
					}
				}
			);
		}

		function render(){
			let hash= location.hash || '#';

			Mura.renderFilename(
				hash.split('#')[1],
				Mura.getQueryStringParams()
			).then(content=>{

				renderTemplate(content.get('template')).then(()=>{

					Mura('.mura-content').html(content.get('body'));
					Mura('.mura-html-queues').html(content.get('htmlheadqueue') + content.get('htmlfootqueue'));

					Mura.extend(Mura,content.get('config'));

					Mura('.mura-region-container').each(item=>{
						var item=Mura(item);
						item.html(content.renderDisplayRegion(item.data('region')));
					});

					if(content.hasParent() && content.get('type') != 'Folder' && content.get('type') != 'Calendar'){
						buildNav(Mura('.mura-child-nav'),content.get('contentid'));
					} else {
						Mura('.mura-child-nav').html('');
					}

					buildCrumbs(content);

					Mura(document).processMarkup();

				})

			});
		}

		render();

		Mura(window).on('hashchange', render);

	});
}());
