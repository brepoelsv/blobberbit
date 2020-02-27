import vars from './variables';

import {
  startGameFirst
} from './startGame';

export default () => {
  const servers = [];
  const serversIP = {};
  if (process.env.NODE_ENV === 'development') {
    const option = `<li class="uk-nav-header">Local</li>
                    <li><a data-server="${process.env.DOMAIN}">${process.env.DOMAIN}</a></li>`;
    $('#chooseServerSelect').append(option);
    $('#currentServer').text(process.env.DOMAIN);
    if (process.env.DOMAIN !== 'localhost') {
      vars.serverHost = `wss://blobber.io`;
    } else {
      vars.serverHost = `ws://blobber.io:${process.env.PORT}`;
    }
  }

  $.get('/serverList').then(list => {
    const server = list.filter(e => e.available);
    let last = '';
    server.map((s) => {
      serversIP[s.ip] = {
        ip: s.ip,
        name: s.name,
        users: s.users
      };
      let option;
      s.users = s.users + Math.floor(Math.random() * 30) + 20;
      if (s.region !== last) {
        option = `<li class="uk-nav-header">${s.region}</li>
                  <li><a data-server="${s.ip}">${s.name} (${s.users} users)</a></li>`;
      } else {
        option = `<li><a data-server="${s.ip}">${s.name} (${s.users} users)</a></li>`;
      }
      last = s.region;
      $('#chooseServerSelect').append(option);
    });
    server.sort((a, b) => {
      return a.users - b.users;
    });
    if (window.server) {
      if (serversIP[window.server]) {
        vars.serverHost = `wss://${window.server}`;
        $('#currentServer').text(`${serversIP[window.server].name}`);
      } else {
        $('#currentServer').text(`${server[0].name} (${server[0].users} users)`);
        vars.serverHost = `wss://${server[0].ip}`;
      }
    } else {
      if (process.env.NODE_ENV !== 'development') {
        $('#currentServer').text(`${server[0].name} (${server[0].users} users)`);
        vars.serverHost = `wss://${server[0].ip}`;
      }
    }
    startGameFirst();
  });

  $('#chooseServerSelect').on('click', '> li > a', (e) => {
    const value = e.target.attributes['data-server'].value;
    $('#currentServer').text(e.target.text);
    vars.serverHost = value === 'localhost'
      ? `ws://${process.env.IP}:${process.env.PORT}`
      : `wss://${value}`;
    let hash = value;
    for (let i = 0; i < servers.length; i++) {
      if (servers[i].ip === value) {
        hash = servers[i].hash;
      }
    }
    $.post('/settings/server', {
      option: hash
    });
    startGameFirst();
  });
};
