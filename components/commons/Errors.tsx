export const Errors = ({ errors }: { errors: string[] }) => {
  if (!errors.length) return null;
  return (
    <>
      {errors.map((err) => (
        <p key={err} className="pl-1 pt-2 text-sm text-red-500">
          {err}
        </p>
      ))}
    </>
  );
};
