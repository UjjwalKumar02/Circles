interface PopupCardProps {
  children: React.ReactNode;
}

export const PopupCard = ({ children }: PopupCardProps) => {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/20 flex justify-center items-center">
      <div className="bg-white px-12 py-8 flex flex-col gap-6 rounded-lg">
        {children}
      </div>
    </div>
  );
};
