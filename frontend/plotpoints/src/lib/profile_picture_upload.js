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
    throw new Error(result.detail || "Failed to upload profile picture");
  }

  return result;
}