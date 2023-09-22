{ pkgs ? import <nixpkgs> { } }:
with pkgs;
mkShell {
  packages = [
    docker
    python311Packages.venvShellHook
    awscli2
  ];
  venvDir = ".venv";

  postVenvCreation = ''
    python -m pip install -r requirements.txt
  '';
}

