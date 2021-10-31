// this is the code which will be injected into a given page...
(function() { // keep this code in a function to avoid polluting the global namespace
	// set up vars
	var wallet = window.location.pathname.split('/')[1];

	// general hicdex wrapper function
	async function fetchGraphQL(operationsDoc, operationName, variables) {
		const result = await fetch(
			"https://api.hicdex.com/v1/graphql",
			{
			method: "POST",
			body: JSON.stringify({
				query: operationsDoc,
				variables: variables,
				operationName: operationName
			})
			}
		);
		return await result.json();
	}

	// check if wallet has hicetnunc account
	async function hicExists(wallet) {
		const { errors, data } = await fetchGraphQL(`query HicExists($wallet: String!) {
			hic_et_nunc_holder(where: {address: {_eq: $wallet}}) {
			address
			}
		}`, "HicExists", {"wallet":wallet});
		if (errors) {
			console.error(errors);
		}
		const result = data.hic_et_nunc_holder[0] !== undefined;
		// console.log({ result })
		return result
	}

	// check banlist
	fetch('https://raw.githubusercontent.com/hicetnunc2000/hicetnunc-reports/main/filters/w.json')
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			// console.log(json)
			if (json.includes(wallet)) {
				// wait for the page to load then show ban message
				function maybeBan() {
					// ban label
					var acc_title = document.querySelector('.acc-info .v-list-item__title');
					if (acc_title) {
						var acc_title_add = document.createElement('div');
						acc_title_add.innerHTML = 'BANNED';
						acc_title_add.style.color = 'red';
						acc_title.appendChild(acc_title_add);
					} else {
						setTimeout(maybeBan, 500);
					}
				}
				maybeBan();
			}
		});	

	hicExists(wallet).then(function(result) {
		if (result) {
			// wait for page to load, then add hicetnunc link
			function maybeAddLink() {
				var acc_links = document.querySelector('.acc-info > div:first-child > div:last-child > div:first-child');
				if (acc_links) {
					var acc_links_add = document.createElement('div');
					acc_links_add.innerHTML = '<div><a href="https://hicetnunc.xyz/tz/'+wallet+'" target="_blank" class="v-btn v-btn--icon v-btn--round theme--light v-size--default primary--text" rel="nofollow noopener"><span class="v-btn__content"><span aria-hidden="true" class="v-icon notranslate theme--light" style="font-size: 24px; height: 24px; width: 24px;"><svg viewBox="0 0 196.87 53.23" fill="#005377"><path d="M228.9,79.31H211.51a2.26,2.26,0,0,1-.35-.34.75.75,0,0,1-.16-.42c0-11.42,0-22.85,0-34.43H193.24v35H175.41V26.27H228.9Z" transform="translate(-32.03 -26.27)"></path><path d="M67.74,43.78V26.42H85.41V79.19H67.91V62.38a4.24,4.24,0,0,0-.52-.57.77.77,0,0,0-.42-.17H50V79.08H32V26.48H49.78v17.3Z" transform="translate(-32.03 -26.27)"></path><path d="M103.62,43.79V26.43h53.6c.09,5.62,0,11.41.05,17.36Z" transform="translate(-32.03 -26.27)"></path><path d="M103.71,61.71h53.38V78.84c-4.05.69-38.16.91-53.38.31Z" transform="translate(-32.03 -26.27)"></path></svg></span></span></a></div>';
					acc_links.insertBefore(acc_links_add, acc_links.firstChild);
				} else {
					setTimeout(maybeAddLink, 500);
				}
			}
			maybeAddLink();
		}
	});
	// wait for page to load, then add copybuster link
	function maybeCopybusterLink() {
		var acc_links = document.querySelector('.acc-info > div:first-child > div:last-child > div:first-child');
		if (acc_links) {
			var acc_links_add = document.createElement('div');
			acc_links_add.innerHTML = '<div><a href="https://copybuster.vercel.app/?tz='+wallet+'" target="_blank" class="v-btn v-btn--icon v-btn--round theme--light v-size--default primary--text" rel="nofollow noopener"><span class="v-btn__content"><span aria-hidden="true" class="v-icon notranslate theme--light" style="font-size: 24px; height: 24px; width: 24px;">🕵️‍♀️</span></span></a></div>';
			acc_links.insertBefore(acc_links_add, acc_links.firstChild);
		} else {
			setTimeout(maybeCopybusterLink, 500);
		}
	}
	setTimeout(maybeCopybusterLink, 500);
})();