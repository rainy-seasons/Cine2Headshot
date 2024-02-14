let popupElement = null;

function handleClick(event) {
	const clickedElement = event.target;

	if (clickedElement.className === "xmark") {
		if (clickedElement.textContent === "Top Billed Cast: ")	{
			const castList = clickedElement.parentElement.textContent
			  .replace("Top Billed Cast: ", "")
			  .trim();

			const castListArray = castList.split(',').map(item => item.trim());
			let imageUrlArray = [];
			for (var i = 0; i < castListArray.length; i++)
			{
				fetchHeadshot(castListArray[i]).then(value => imageUrlArray[i] = value);
				//imageUrlArray[i] = fetchHeadshot(castListArray[i]).then(value => imageUrlArray[i] = value);
			}

			console.log(imageUrlArray);

			//fetchHeadshot(castListArray);
			
		}
	}

	if (clickedElement.className === "connection-name") {
		fetchHeadshot(clickedElement.textContent.trim()).then(value => showPopup(value));
	}
}

function fetchHeadshot(name) {
	const options = {
	  method: 'GET',
	  headers: {
		accept: 'application/json',
		Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZGU3NzIyMDYzMWVhMGRlZGJlMTU0ZmNiZjc3YmYzZSIsInN1YiI6IjY1Y2E3NWM2MDgzNTQ3MDE4NGNmZWU4NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Gq9O289XcPmUqSnDszqGmdbNb9jeHgPiyW4EHKnPoC4'
	  }
	};

	fetchURL = 'https://api.themoviedb.org/3/search/person?query=' + name + '&include_adult=false&language=en-US&page=1' 


	 return fetch(fetchURL, options)
		.then(response => response.json())
		.then(data => {
		  console.log(data);
		  if (data.results.length > 0) {
			  return data.results[0].profile_path;
		  } else {
			console.log("No results found for ", name);
		  }
		})
	.catch(err => console.error(err));
}


function showPopup(imageUrl) {
	const prefix = 'https://media.themoviedb.org/t/p/w300_and_h450_bestv2';
	let imageUrlFull = prefix + imageUrl;
	console.log("IMAGE URL FULL: ", imageUrlFull);

	// Delete the old popup window. So they don't "stack"
	if (popupElement) {
		popupElement.parentNode.removeChild(popupElement);
		popupElement = null;
	}

	// Calculate the horizontal position
	const viewportWidth = window.innerWidth;
	const horizontalPosition = (viewportWidth / 3) - 250;

	const popupHtml = `
		<div style="position: fixed; top: 50px; left: ${horizontalPosition}px; background: white; border: 1px solid black; padding: 10px;">
		  <button id="closeButton" style="position: absolute; top: 5px; right: 5px; background: transparent; border: none; cursor: pointer; font-size: 20px;">x</button>
		  <img src="${imageUrlFull}" style="width: auto; height: auto;">
		</div>
	  `;

	popupElement = document.createElement('div');
	popupElement.innerHTML = popupHtml;
	document.body.appendChild(popupElement);

	const closeButton = document.getElementById('closeButton');
	closeButton.addEventListener('click', closePopup);
}

function closePopup() {
	if (popupElement)  {
		popupElement.parentNode.removeChild(popupElement);
		popupElement = null;
	}
}


document.addEventListener('click', handleClick);
