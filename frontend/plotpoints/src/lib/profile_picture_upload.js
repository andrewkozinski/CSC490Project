export async function uploadProfilePicture(file, jwtToken) {
  const formData = new FormData();
  formData.append("profile_pic_file", file);

  const response = await fetch(
    `/api/profiles/update/profile_picture?jwt_token=${jwtToken}`,
    {
      method: "PUT",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {

    //Check if token is invalid or expired
    if(response.status === 401) {
        //Show alert
        alert("Session Expired: Please log in again.");
        throw new Error("Unauthorized: Please log in again.");
    }

    throw new Error(result.detail || "Failed to upload profile picture");
  }

  return result;
}