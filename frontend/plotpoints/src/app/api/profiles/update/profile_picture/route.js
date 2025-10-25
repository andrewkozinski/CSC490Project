export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const jwtToken = searchParams.get("jwt_token");

    if (!jwtToken) {
      return new Response(
        JSON.stringify({ detail: "Missing jwt_token query parameter" }),
        { status: 400 }
      );
    }

    // Read form data (the uploaded image file)
    const formData = await request.formData();
    const file = formData.get("profile_pic_file");

    if (!file) {
      return new Response(
        JSON.stringify({ detail: "profile_pic_file is required" }),
        { status: 400 }
      );
    }

    //Now pray it works
    const backendResponse = await fetch(
      `${process.env.API_URL}/profiles/update_profile_picture?jwt_token=${jwtToken}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    const result = await backendResponse.json();

    return new Response(JSON.stringify(result), {
      status: backendResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return new Response(
      JSON.stringify({ detail: "Internal Server Error" }),
      { status: 500 }
    );
  }
}