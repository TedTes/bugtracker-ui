

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');
function jsonDateReviver(key, value) {
if (dateRegex.test(value)) return new Date(value);
return value;
}

export default async function graphQLFetch(query, variables = {},showError=null) {
   
    const options={
        method:'POST',
       headers:{'Content-Type':'application/json'} ,
       body:JSON.stringify({query,variables}),
        credentials:'include'
    }
    try {
    const response = await fetch(window.ENV.UI_API_ENDPOINT, options);
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);
    if (result.errors) {
    const error = result.errors[0];
    if (error.extensions.code === 'BAD_USER_INPUT') {
    const details = error.extensions.exception.errors.join('\n ');
   // alert(`${error.message}:\n ${details}`);
    if(showError)
    showError(`${error.message}:\n ${details}`);
    } else if(showError) {
   // alert(`${error.extensions.code}: ${error.message}`);
     showError(`${error.extensions.code}: ${error.message}`)
    }
    }
    return result.data;
    } catch (e) {
        if(showError)
   // alert(`Error in sending data to server: ${e.message}`);
   showError(`Error in sending data to server: ${e.message}`)
    }
    }