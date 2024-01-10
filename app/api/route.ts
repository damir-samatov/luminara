export const GET = async (req: Request) => {
  return Response.json({ msg: "API ROOT" }, { status: 200 });
};
