Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.box_url = "https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box"
  config.vm.hostname = "sourceSwitcher.vagrant.vm"
  config.vm.network :forwarded_port, guest: 80, host: 4444
    config.vm.network :forwarded_port, guest: 5984, host: 6000
  config.vm.synced_folder "", "/var/www"
  config.vm.provision :shell, :path => "_vagrant/bootstrap.sh"
end
