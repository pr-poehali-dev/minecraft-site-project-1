        {/* Auth Modal */}
        <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    </AuthContext.Provider>
  );
};

export default Index;