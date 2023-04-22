export default async function parseInvalidResponse(
  response: Response,
  setFieldError: (field: string, errorMsg: string) => void,
  setFormError: (errorMsg: string) => void,
  success_url?: string | true
): Promise<Response> {
  if (response.ok) {
    if (success_url === true) {
      window.location.reload();
    } else if (success_url) {
      window.location.href = success_url;
    }
    return response;
  }

  let response_json: any;
  try {
    response_json = await response.json();
  } catch (error) {
    setFormError(`Response is not JSON`);
    console.log(response);
    return response;
  }

  Object.keys(response_json).forEach((key: string) => {
    if (key === "non_field_errors") {
      setFormError(response_json[key]);
    } else {
      setFieldError(key, response_json[key]);
    }
  });
  console.log("Invalid request: ", response_json);

  return response;
}
